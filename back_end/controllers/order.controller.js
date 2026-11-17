import Order from "../models/order.model.js";
import Cart from "../models/user.cart.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

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

// Place Order
export const placeOrder = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return sendError(res, 400, "Please provide a delivery address.");
        }

        // Step 1 — Get user's cart with product details populated
        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return sendError(res, 400, "Your cart is empty.");
        }

        // Step 2 — Check stock for every product before doing anything
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

        // Step 3 — Group cart items by seller — one Order per seller per checkout
        const groups = {};
        for (let item of cart.products) {
            const sellerKey = item.product.seller ? item.product.seller.toString() : "unassigned";
            if (!groups[sellerKey]) groups[sellerKey] = [];
            groups[sellerKey].push(item);
        }

        // Step 5 — Create one order per seller group
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
                address,
                status: "pending_approval",
                paymentStatus: "pending"
            });

            createdOrders.push(order);
        }

        // Step 6 — Reduce stock for each product (iterate ALL cart items, not the groups)
        for (let item of cart.products) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );

            // SOCKET.IO HOOK (add in Phase 6):
            // const updated = await Product.findById(item.product._id);
            // if (updated.stock === 0) {
            //     io.emit("product:soldout", { productId: item.product._id });
            // } else {
            //     io.emit("product:stock_updated", { productId: item.product._id, stock: updated.stock });
            // }
        }

        // Step 7 — Clear the cart
        cart.products = [];
        await cart.save();

        return sendSuccess(res, 201, "Order Placed Successfully.", { orders: createdOrders });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Get All Orders For Logged In User
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
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

        if (!ALLOWED_TRANSITIONS[order.status].includes(status)) {
            return sendError(res, 400, `Cannot change status from ${order.status} to ${status}.`);
        }

        order.status = status;
        if (status === "delivered") {
            order.deliveredAt = new Date();
        }
        if (status === "refunded" && order.paymentStatus === "paid") {
            for (let item of order.products) {
                if (item.product) {
                    await Product.findByIdAndUpdate(
                        item.product,
                        { $inc: { stock: item.quantity } }
                    );
                }
            }
        }
        await order.save();

        return sendSuccess(res, 200, "Order Status Updated.", { order });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Cancel Order — User can cancel only if status is "placed"
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.product");

        if (!order) {
            return sendError(res, 404, "Order Not Found.");
        }

        if (order.user.toString() !== req.userId) {
            return sendError(res, 403, "Unauthorized Access.");
        }

        if (order.status !== "placed" && order.status !== "pending_approval") {
            return sendError(res, 400, "Only placed or pending-approval orders can be cancelled.");
        }

        // Restore stock for each product
         if (order.paymentStatus === "paid") {
            for (let item of order.products) {
                if (item.product) {
                    await Product.findByIdAndUpdate(
                        item.product._id,
                        { $inc: { stock: item.quantity } }
                    );
                }
            }
        }

        order.status = "cancelled";
        await order.save();

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

        return sendSuccess(res, 200, "Return Requested Successfully.", { order });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};


// Get Orders For Logged In Seller — only orders whose seller is req.userId
export const getMySellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.userId })
            .populate("user", "name")
            .populate("products.product", "title image price")
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Seller Orders Fetched Successfully.", { orders });

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};