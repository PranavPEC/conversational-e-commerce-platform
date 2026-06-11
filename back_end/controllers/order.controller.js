import Order from "../models/order.model.js";
import Cart from "../models/user.cart.js";
import Product from "../models/user.product.js";

// Place Order
export const placeOrder = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ message: "Please provide a delivery address." });
        }

        // Step 1 — Get user's cart with product details populated
        const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." });
        }

        // Step 2 — Check stock for every product before doing anything
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Only ${item.product.stock} unit(s) of "${item.product.title}" available.`
                });
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

        return res.status(201).json({
            message: "Order Placed Successfully.",
            order: newOrder
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Get All Orders For Logged In User
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("products.product", "title image price")
            .sort({ createdAt: -1 }); // newest first

        return res.status(200).json({ orders });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Get Single Order By ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.product", "title image price");

        if (!order) {
            return res.status(404).json({ message: "Order Not Found." });
        }

        // Only the owner can see their order
        if (order.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized Access." });
        }

        return res.status(200).json({ order });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Update Order Status — Admin Only
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["placed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order Not Found." });
        }

        return res.status(200).json({ message: "Order Status Updated.", order });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Cancel Order — User can cancel only if status is "placed"
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.product");

        if (!order) {
            return res.status(404).json({ message: "Order Not Found." });
        }

        if (order.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized Access." });
        }

        if (order.status !== "placed") {
            return res.status(400).json({
                message: "Only placed orders can be cancelled."
            });
        }

        // Restore stock for each product
        for (let item of order.products) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: item.quantity } }
            );
        }

        order.status = "cancelled";
        await order.save();

        return res.status(200).json({ message: "Order Cancelled Successfully.", order });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};