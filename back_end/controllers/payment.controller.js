import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/user.cart.js";
import Order from "../models/order.model.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import Address from "../models/address.model.js";
// Razorpay instance — reads keys from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ── STEP 1: Frontend calls this to get a Razorpay order ID ──
// POST /payment/create-order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { addressId } = req.body;

        if (!addressId) {
            return sendError(res, 400, "Please select a delivery address.");
        }

        const savedAddress = await Address.findOne({ _id: addressId, user: req.userId });
        if (!savedAddress) {
            return sendError(res, 404, "Selected address not found.");
        }

        // Get user's cart with product details
        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return sendError(res, 400, "Your cart is empty.");
        }

        // Check stock for every item before creating the payment
        const unavailableItems = [];
        for (let item of cart.products) {
            if (!item.product) {
                unavailableItems.push(item._id);
                continue;
            }

            if (item.product.stock < item.quantity) {
                return sendError(res, 400, `Only ${item.product.stock} unit(s) of "${item.product.title}" available.`);
            }
        }

        if (unavailableItems.length > 0) {
            return sendError(res, 400, "Some items in your cart are no longer available. Please remove them and try again.", { unavailableItems });
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

        // Create one internal pending order per seller — same razorpayOrderId on all of
        // them so verifyPayment can later find every sibling order from this checkout
        // paymentStatus stays "pending" until payment is verified
        const groups = {};
        for (let item of cart.products) {
            const sellerKey = item.product.seller ? item.product.seller.toString() : "unassigned";
            if (!groups[sellerKey]) groups[sellerKey] = [];
            groups[sellerKey].push(item);
        }

        const createdOrders = [];
        for (const sellerKey of Object.keys(groups)) {
            const groupItems = groups[sellerKey];

            const groupProducts = groupItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }));

            const groupTotal = groupItems.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);

            const order = await Order.create({
                user: req.userId,
                seller: sellerKey === "unassigned" ? undefined : sellerKey,
                products: groupProducts,
                totalAmount: groupTotal,
                address: {
                    label: savedAddress.label,
                    fullName: savedAddress.fullName,
                    phone: savedAddress.phone,
                    line1: savedAddress.line1,
                    line2: savedAddress.line2,
                    city: savedAddress.city,
                    state: savedAddress.state,
                    pincode: savedAddress.pincode,
                },
                addressId: savedAddress._id,
                status: "pending_approval",
                paymentStatus: "pending",
                razorpayOrderId: razorpayOrder.id
            });

            createdOrders.push(order);
        }

        // Send Razorpay order details to the frontend
        // Frontend needs: id, amount, currency to open the payment modal
        return sendSuccess(res, 201, "Razorpay Order Created Successfully.", {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderIds: createdOrders.map(o => o._id),
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
            // Signature mismatch — mark all sibling orders from this checkout as failed
            await Order.updateMany({ razorpayOrderId: razorpay_order_id }, { paymentStatus: "failed" });
            return sendError(res, 400, "Payment verification failed.");
        }

        // Signature matched — payment is genuine
        // Find every order created from this checkout (one per seller) and mark as paid
        const orders = await Order.find({ razorpayOrderId: razorpay_order_id }).populate("products.product");

        if (!orders || orders.length === 0) {
            return sendError(res, 404, "Order not found.");
        }

        await Order.updateMany(
            { razorpayOrderId: razorpay_order_id },
            { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id }
        );

        // Reduce stock for each product, across all sibling orders
        for (let order of orders) {
            for (let item of order.products) {
                if (item.product) {
                    await Product.findByIdAndUpdate(
                        item.product._id,
                        { $inc: { stock: -item.quantity } }
                    );
                }

                // SOCKET.IO HOOK (add in Step 15):
                // const updated = await Product.findById(item.product._id);
                // if (updated.stock === 0) {
                //     io.emit("product:soldout", { productId: item.product._id });
                // } else {
                //     io.emit("product:stock_updated", { productId: item.product._id, stock: updated.stock });
                // }
            }
        }

        // Clear the cart
        const cart = await Cart.findOne({ user: req.userId });
        if (cart) {
            cart.products = [];
            await cart.save();
        }

        return sendSuccess(res, 200, "Payment Verified. Order Placed Successfully.", { orders });

    } catch (error) {
        console.log("PAYMENT ERROR:", error)
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};