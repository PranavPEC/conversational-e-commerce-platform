import Product from "../models/user.product.js";
import Order from "../models/order.model.js";
import { emitStockUpdate } from "../socket/emitters.js";

// How long a checkout may hold stock before it is given back
export const RESERVATION_MINUTES = 15;

// Give stock back to the shelf. lines: [{ productId, quantity }]
export const restoreStock = async (lines) => {
    for (const { productId, quantity } of lines) {
        const restored = await Product.findOneAndUpdate(
            { _id: productId },
            { $inc: { stock: quantity } },
            { returnDocument: "after" }
        );
        if (restored) emitStockUpdate(restored);   // null if the product was deleted
    }
};

// Take stock for every line, all or nothing.
// The check ("is there enough?") and the decrement happen in ONE atomic
// MongoDB operation, so two buyers can never both take the last unit.
export const reserveStock = async (lines) => {
    const taken = [];

    for (const { productId, quantity } of lines) {
        const updated = await Product.findOneAndUpdate(
            { _id: productId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { returnDocument: "after" }
        );

        if (!updated) {
            // Not enough left: undo whatever we already took from earlier lines
            await restoreStock(taken);
            return { ok: false, failedProductId: productId };
        }

        taken.push({ productId, quantity });
        emitStockUpdate(updated, { notifySeller: true });
    }

    return { ok: true };
};

// Give back the stock held by ONE order, at most once.
// The flag is flipped first; only the caller who flips it restocks, so
// cancelling twice, or cancelling while the sweeper runs, can't double-restore.
export const releaseOrderStock = async (orderId) => {
    const order = await Order.findOneAndUpdate(
        { _id: orderId, stockReserved: true },
        { $set: { stockReserved: false } },
        { returnDocument: "after" }
    );
    if (!order) return false;   // already released, or never held stock

    await restoreStock(
        order.products.map((p) => ({ productId: p.product, quantity: p.quantity }))
    );
    return true;
};

// Close unpaid orders that are holding stock and give the stock back.
// finalStatus: "expired" (timeout/abandoned) or "failed" (bad payment signature)
const closePendingOrders = async (filter, finalStatus) => {
    const candidates = await Order.find({
        ...filter,
        paymentStatus: "pending",
        stockReserved: true,
    }).select("_id");

    let released = 0;
    for (const { _id } of candidates) {
        // Flip the payment status atomically. If a payment confirmation got there
        // first, this finds nothing and we leave the order alone.
        const order = await Order.findOneAndUpdate(
            { _id, paymentStatus: "pending", stockReserved: true },
            { $set: { paymentStatus: finalStatus } },
            { returnDocument: "after" }
        );
        if (order && (await releaseOrderStock(order._id))) released++;
    }
    return released;
};

// Background sweep: reservations whose time ran out
export const releaseExpiredReservations = () =>
    closePendingOrders({ reservationExpiresAt: { $lt: new Date() } }, "expired");

// The buyer starts a new checkout: drop any earlier unpaid one
export const releaseUserPendingCheckouts = (userId) =>
    closePendingOrders({ user: userId }, "expired");

// One specific checkout (buyer closed the payment window, or the signature was bad)
export const releaseCheckout = (userId, razorpayOrderId, finalStatus = "expired") =>
    closePendingOrders({ user: userId, razorpayOrderId }, finalStatus);