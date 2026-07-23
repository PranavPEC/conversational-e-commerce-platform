import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/user.cart.js";
import Order from "../models/order.model.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Razorpay instance — reads keys from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ── STEP 1: Frontend calls this to get a Razorpay order ID ──
// POST /payment/create-order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return sendError(res, 400, "Please provide a delivery address.");
        }

        // Get user's cart with product details
        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return sendError(res, 400, "Your cart is empty.");
        }

        // Check stock for every item before creating the payment
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return sendError(res, 400, `Only ${item.product.stock} unit(s) of "${item.product.title}" available.`);
            }
        }

        // Calculate total in paise (Razorpay uses smallest currency unit)
        // ₹1 = 100 paise, so ₹500 = 50000
        const totalAmount = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        const amountInPaise = Math.round(totalAmount * 100);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        // Create a pending order in our database
        // paymentStatus stays "pending" until payment is verified
        const orderProducts = cart.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const newOrder = await Order.create({
            user: req.userId,
            products: orderProducts,
            totalAmount,
            address,
            status: "placed",
            paymentStatus: "pending",
            razorpayOrderId: razorpayOrder.id
        });

        // Send Razorpay order details to the frontend
        // Frontend needs: id, amount, currency to open the payment modal
        return sendSuccess(res, 201, "Razorpay Order Created Successfully.", {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderId: newOrder._id,
            keyId: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log("PAYMENT ERROR:", error)
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// ── STEP 2: After user pays, Razorpay calls this to verify ──
// POST /payment/verify
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        // Signature verification — this is how we confirm Razorpay actually
        // made this request and the payment is genuine
        // Formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            // Signature mismatch — mark order as failed
            await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });
            return sendError(res, 400, "Payment verification failed.");
        }

        // Signature matched — payment is genuine
        // Update order: mark as paid, store the Razorpay payment ID
        const order = await Order.findById(orderId).populate("products.product");

        if (!order) {
            return sendError(res, 404, "Order not found.");
        }

        order.paymentStatus = "paid";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // Reduce stock for each product
        for (let item of order.products) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );

            // SOCKET.IO HOOK (add in Step 15):
            // const updated = await Product.findById(item.product._id);
            // if (updated.stock === 0) {
            //     io.emit("product:soldout", { productId: item.product._id });
            // } else {
            //     io.emit("product:stock_updated", { productId: item.product._id, stock: updated.stock });
            // }
        }

        // Clear the cart
        const cart = await Cart.findOne({ user: req.userId });
        if (cart) {
            cart.products = [];
            await cart.save();
        }

        return sendSuccess(res, 200, "Payment Verified. Order Placed Successfully.", { order });

    } catch (error) {
        console.log("PAYMENT ERROR:", error)
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};