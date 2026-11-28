import Order from "../models/order.model.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { emitOrderStatusChanged } from "../socket/emitters.js";
import { releaseOrderStock } from "../utils/inventory.js";

const RETURN_WINDOW_DAYS = 7;

const ALLOWED_TRANSITIONS = {
    pending_approval: ["placed", "rejected", "cancelled"],
    placed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["return_requested"],
    return_requested: ["return_approved", "return_rejected"],
    return_approved: ["refunded"],
    return_rejected: [],
    refunded: [],
    cancelled: [],
    rejected: [],
};

// When an order ends in one of these, the customer is not keeping the goods,
// so the units go back on the shelf. (return_rejected: customer keeps them.)
const STOCK_RELEASING_STATUSES = ["cancelled", "rejected", "refunded"];

// NOTE: the old placeOrder endpoint was removed on purpose. It created orders and
// took stock WITHOUT any payment. Orders are now created only by the Razorpay
// flow in payment.controller.js.


// Get All Orders For Logged In User (paid orders only: an unpaid checkout is
// not an order yet)
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId, paymentStatus: "paid" })
            .populate("products.product", "title image price")
            .sort({ createdAt: -1 }); // newest first

        return sendSuccess(res, 200, "Orders Fetched Successfully.", { orders });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Get Single Order By ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.product", "title image price");

        if (!order) {
            return sendError(res, 404, "Order Not Found.");
        }

        // Only the owner can see their order
        if (order.user.toString() !== req.userId) {
            return sendError(res, 403, "Unauthorized Access.");
        }

        return sendSuccess(res, 200, "Order Fetched Successfully.", { order });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Update Order Status — Seller (own orders) or Admin, subject to ALLOWED_TRANSITIONS
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!Object.keys(ALLOWED_TRANSITIONS).includes(status)) {
            return sendError(res, 400, "Invalid status value.");
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return sendError(res, 404, "Order Not Found.");
        }

        if (req.userRole !== "admin" && order.seller.toString() !== req.userId) {
            return sendError(res, 403, "Unauthorized Access.");
        }

        // Nobody may approve, ship or otherwise progress an order that isn't paid
        if (order.paymentStatus !== "paid") {
            return sendError(res, 400, "This order has not been paid for yet.");
        }

        if (!ALLOWED_TRANSITIONS[order.status].includes(status)) {
            return sendError(res, 400, `Cannot change status from ${order.status} to ${status}.`);
        }

        order.status = status;
        if (status === "delivered") {
            order.deliveredAt = new Date();
        }
        await order.save();

        // Give the stock back when the customer is not keeping the goods.
        // Safe to repeat: stock is only restored once per order.
        if (STOCK_RELEASING_STATUSES.includes(status)) {
            try {
                await releaseOrderStock(order._id);
            } catch (releaseError) {
                console.error("Stock release failed for order", order._id.toString(), releaseError.message);
            }
        }

        // Tell the other party (buyer, and the seller if an admin made the change).
        // The person who made the change is skipped: their screen already updated.
        emitOrderStatusChanged(order, req.userId);

        return sendSuccess(res, 200, "Order Status Updated.", { order });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Cancel Order — User can cancel a paid order that is still "placed" or pending approval
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return sendError(res, 404, "Order Not Found.");
        }

        if (order.user.toString() !== req.userId) {
            return sendError(res, 403, "Unauthorized Access.");
        }

        // An unpaid checkout is closed by releasing it, not by cancelling an order
        if (order.paymentStatus !== "paid") {
            return sendError(res, 400, "Only paid orders can be cancelled.");
        }

        if (order.status !== "placed" && order.status !== "pending_approval") {
            return sendError(res, 400, "Only placed or pending-approval orders can be cancelled.");
        }

        order.status = "cancelled";
        await order.save();

        // Put the units back on the shelf (at most once)
        try {
            await releaseOrderStock(order._id);
        } catch (releaseError) {
            console.error("Stock release failed for order", order._id.toString(), releaseError.message);
        }

        // Notify the seller that the customer cancelled
        emitOrderStatusChanged(order, req.userId);

        return sendSuccess(res, 200, "Order Cancelled Successfully.", { order });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Request Return — User can request within RETURN_WINDOW_DAYS after delivery
export const requestReturn = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return sendError(res, 404, "Order Not Found.");
        }

        if (order.user.toString() !== req.userId) {
            return sendError(res, 403, "Unauthorized Access.");
        }

        if (order.status !== "delivered") {
            return sendError(res, 400, "Only delivered orders can be returned.");
        }

        if (!order.deliveredAt) {
            return sendError(res, 400, "This order cannot be returned because its delivery date is missing.");
        }

        const elapsedMs = Date.now() - order.deliveredAt.getTime();
        const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
        if (elapsedDays > RETURN_WINDOW_DAYS) {
            return sendError(res, 400, `Returns can only be requested within ${RETURN_WINDOW_DAYS} days of delivery.`);
        }

        order.status = "return_requested";
        order.returnReason = reason || "";
        await order.save();

        // Notify the seller that the customer requested a return
        emitOrderStatusChanged(order, req.userId);

        return sendSuccess(res, 200, "Return Requested Successfully.", { order });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Get Orders For Logged In Seller — only PAID orders whose seller is req.userId
export const getMySellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.userId, paymentStatus: "paid" })
            .populate("user", "name")
            .populate("products.product", "title image price")
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Seller Orders Fetched Successfully.", { orders });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};