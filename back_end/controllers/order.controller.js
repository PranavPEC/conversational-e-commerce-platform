import Order from "../models/order.model.js";
import Cart from "../models/user.cart.js";
import Product from "../models/user.product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

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
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return sendError(res, 400, `Only ${item.product.stock} unit(s) of "${item.product.title}" available.`);
            }
        }

        // Step 3 — Calculate total using current prices
        const totalAmount = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // Step 4 — Build products array with price snapshot
        // We store the price at the time of order because product prices can change later
        const orderProducts = cart.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        // Step 5 — Create the order
        const newOrder = await Order.create({
            user: req.userId,
            products: orderProducts,
            totalAmount,
            address,
            status: "placed",
            paymentStatus: "pending"
        });

        // Step 6 — Reduce stock for each product
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

        return sendSuccess(res, 201, "Order Placed Successfully.", { order: newOrder });

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


// Update Order Status — Admin Only
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["placed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return sendError(res, 400, "Invalid status value.");
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after' }
        );

        if (!order) {
            return sendError(res, 404, "Order Not Found.");
        }

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

        if (order.status !== "placed") {
            return sendError(res, 400, "Only placed orders can be cancelled.");
        }

        // Restore stock for each product
         if (order.paymentStatus === "paid") {
            for (let item of order.products) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { stock: item.quantity } }
                );
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