import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/user.cart.js";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import { calculateCartPricing } from "../utils/cartPricing.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import Address from "../models/address.model.js";
import { emitOrderCreated } from "../socket/emitters.js";
import {
    RESERVATION_MINUTES,
    reserveStock,
    restoreStock,
    releaseUserPendingCheckouts,
    releaseCheckout,
} from "../utils/inventory.js";

// Razorpay instance — reads keys from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Compare two signatures without leaking timing information
const safeEqual = (a, b) => {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};


// ── STEP 1: Frontend calls this to get a Razorpay order ID ──
// POST /payment/create-order
//
// Flow: validate cart -> RESERVE stock atomically -> create Razorpay order ->
// create one pending Order per seller -> mark them as holding stock.
// If anything fails after the stock was taken, it is given back.
export const createRazorpayOrder = async (req, res) => {
    // What we have taken so far, so a failure can undo it
    let reservedLines = null;
    let razorpayOrderId = null;

    try {
        const { addressId } = req.body;

        if (!addressId) {
            return sendError(res, 400, "Please select a delivery address.");
        }

        const savedAddress = await Address.findOne({ _id: addressId, user: req.userId });
        if (!savedAddress) {
            return sendError(res, 404, "Selected address not found.");
        }

        // A retry or a double-click must not leave an earlier unpaid checkout
        // holding stock. Drop it before we look at stock.
        await releaseUserPendingCheckouts(req.userId);

        // Get user's cart with product details
        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return sendError(res, 400, "Your cart is empty.");
        }

        // Quick pre-check so the buyer gets a friendly message.
        // NOT the real guard: the atomic reservation below is.
        const unavailableItems = [];
        for (let item of cart.products) {
            // Deleted products, and legacy products with no seller, can't be sold
            if (!item.product || !item.product.seller) {
                unavailableItems.push(item._id);
                continue;
            }

            if (item.product.stock < item.quantity) {
                const message = item.product.stock <= 0
                    ? `Sorry, "${item.product.title}" just sold out.`
                    : `Only ${item.product.stock} unit(s) of "${item.product.title}" available.`;
                return sendError(res, 409, message);
            }
        }

        if (unavailableItems.length > 0) {
            return sendError(res, 400, "Some items in your cart are no longer available. Please remove them and try again.", { unavailableItems });
        }

        const pricing = await calculateCartPricing(cart);

        let couponRemoved = null;
        if (pricing.couponRemovedReason) {
            cart.appliedCoupon = null;
            await cart.save();
            couponRemoved = pricing.couponRemovedReason;
        }

        // ── THE REAL STOCK GUARD ──
        // Check-and-take in one atomic step per product. If two buyers race for
        // the last unit, exactly one of them gets it; the other gets a 409.
        const lines = cart.products.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
        }));

        const reservation = await reserveStock(lines);
        if (!reservation.ok) {
            const soldOut = cart.products.find((item) =>
                item.product._id.equals(reservation.failedProductId)
            );
            return sendError(
                res,
                409,
                `Sorry, "${soldOut?.product.title || "an item"}" just sold out or doesn't have enough stock left.`
            );
        }
        reservedLines = lines;

        // Calculate total in paise (Razorpay uses smallest currency unit)
        // ₹1 = 100 paise, so ₹500 = 50000
        const amountInPaise = Math.round(pricing.total * 100);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
        razorpayOrderId = razorpayOrder.id;

        // Create one internal pending order per seller — same razorpayOrderId on all of
        // them so verifyPayment can later find every sibling order from this checkout
        const groups = {};
        for (let item of cart.products) {
            const sellerKey = item.product.seller.toString();
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

            const groupSubtotal = groupItems.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
            const groupDiscount = Math.round((pricing.perSellerDiscount[sellerKey] || 0) * 100) / 100;
            const groupTotal = Math.round((groupSubtotal - groupDiscount) * 100) / 100;

            const order = await Order.create({
                user: req.userId,
                seller: sellerKey,
                products: groupProducts,
                subtotal: groupSubtotal,
                discountAmount: groupDiscount,
                couponCode: pricing.appliedCoupon?.code || undefined,
                couponId: pricing.appliedCoupon?._id || undefined,
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

        // Only now, with every order saved, do the orders take over responsibility
        // for the stock we reserved (so it is released with them if they expire).
        const reservationExpiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);
        await Order.updateMany(
            { razorpayOrderId: razorpayOrder.id },
            { $set: { stockReserved: true, reservationExpiresAt } }
        );
        reservedLines = null;

        // Send Razorpay order details to the frontend
        // Frontend needs: id, amount, currency to open the payment modal
        return sendSuccess(res, 201, "Razorpay Order Created Successfully.", {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderIds: createdOrders.map(o => o._id),
            keyId: process.env.RAZORPAY_KEY_ID,
            couponRemoved,
            reservedUntil: reservationExpiresAt,
        });

    } catch (error) {
        // We took stock but never finished creating the orders: give it all back
        if (reservedLines) {
            try {
                if (razorpayOrderId) {
                    await Order.updateMany(
                        { razorpayOrderId },
                        { $set: { paymentStatus: "failed", stockReserved: false } }
                    );
                }
                await restoreStock(reservedLines);
            } catch (cleanupError) {
                console.error("Checkout cleanup failed:", cleanupError.message);
            }
        }

        console.log("PAYMENT ERROR:", error)
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// ── STEP 2: After user pays, the frontend calls this to verify ──
// POST /payment/verify
//
// Safe to call more than once: only the first confirmation has side effects.
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return sendError(res, 400, "Missing payment details.");
        }

        // Only the buyer who started this checkout may verify it
        const owned = await Order.exists({ razorpayOrderId: razorpay_order_id, user: req.userId });
        if (!owned) {
            return sendError(res, 404, "Order not found.");
        }

        // Signature verification — this is how we confirm Razorpay actually
        // made this request and the payment is genuine
        // Formula: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (!safeEqual(expectedSignature, razorpay_signature)) {
            // Fail this buyer's still-unpaid orders from the checkout and free the stock
            await releaseCheckout(req.userId, razorpay_order_id, "failed");
            return sendError(res, 400, "Payment verification failed.");
        }

        // pending -> paid, exactly once. A repeat call finds nothing left to flip.
        const flip = await Order.updateMany(
            { razorpayOrderId: razorpay_order_id, user: req.userId, paymentStatus: "pending" },
            { $set: { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id } }
        );

        let orders = await Order.find({
            razorpayOrderId: razorpay_order_id,
            user: req.userId,
        }).populate("products.product");

        // Late payment: our hold ran out and the stock was released before the
        // payment was confirmed. Try to take the stock again.
        const expiredOrders = orders.filter((o) => o.paymentStatus === "expired");
        let recovered = false;

        if (expiredOrders.length > 0) {
            const lines = expiredOrders.flatMap((o) =>
                o.products
                    .filter((p) => p.product)
                    .map((p) => ({ productId: p.product._id, quantity: p.quantity }))
            );
            const expiredIds = expiredOrders.map((o) => o._id);
            const reservation = await reserveStock(lines);

            if (reservation.ok) {
                await Order.updateMany(
                    { _id: { $in: expiredIds }, paymentStatus: "expired" },
                    { $set: { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id, stockReserved: true } }
                );
                recovered = true;
            } else {
                // Money was taken but the goods are gone. Record it so it can be
                // refunded instead of being lost silently.
                await Order.updateMany(
                    { _id: { $in: expiredIds }, paymentStatus: "expired" },
                    {
                        $set: {
                            paymentStatus: "paid",
                            razorpayPaymentId: razorpay_payment_id,
                            status: "cancelled",
                            needsRefund: true,
                        },
                    }
                );
                return sendError(
                    res,
                    409,
                    "Your payment was received, but an item sold out while you were paying. The order has been cancelled and you will be refunded."
                );
            }

            orders = await Order.find({
                razorpayOrderId: razorpay_order_id,
                user: req.userId,
            }).populate("products.product");
        }

        if (orders.some((o) => o.needsRefund)) {
            return sendError(
                res,
                409,
                "Your payment was received, but an item sold out while you were paying. The order has been cancelled and you will be refunded."
            );
        }

        const firstConfirmation = flip.modifiedCount > 0 || recovered;

        if (!firstConfirmation) {
            // A repeat of an already-confirmed payment: succeed again, repeat nothing
            if (orders.length > 0 && orders.every((o) => o.paymentStatus === "paid")) {
                return sendSuccess(res, 200, "Payment Verified. Order Placed Successfully.", { orders });
            }
            return sendError(res, 400, "This payment could not be confirmed.");
        }

        // ── First confirmation only: side effects run exactly once ──
        // Stock was already taken when the checkout started, so nothing to decrement.

        // Count the coupon once per checkout
        const couponIds = [...new Set(
            orders
                .map((order) => order.couponId?.toString())
                .filter(Boolean)
        )];
        for (const couponId of couponIds) {
            await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
        }

        // Clear the cart
        const cart = await Cart.findOne({ user: req.userId });
        if (cart) {
            cart.products = [];
            cart.appliedCoupon = null;
            await cart.save();
        }

        // Payment confirmed: only now should sellers hear about the new orders
        orders.forEach((order) => emitOrderCreated(order));

        return sendSuccess(res, 200, "Payment Verified. Order Placed Successfully.", { orders });

    } catch (error) {
        console.log("PAYMENT ERROR:", error)
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// ── The buyer closed the payment window without paying ──
// POST /payment/release   body: { razorpay_order_id }
// Gives the held stock back right away instead of waiting for the timeout.
export const releaseCheckoutHold = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return sendError(res, 400, "Missing order id.");
        }

        // Only touches this buyer's orders that are still unpaid
        await releaseCheckout(req.userId, razorpay_order_id, "expired");

        return sendSuccess(res, 200, "Checkout released.");

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};