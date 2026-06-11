import express from "express";

import {
    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from "../controllers/order.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";
import { checkAdmin } from "../middleware/checkAdmin.middleware.js";

const orderRouter = express.Router();

// User Routes
orderRouter.post("/place", checkAuth, placeOrder);
orderRouter.get("/myorders", checkAuth, getUserOrders);
orderRouter.get("/:id", checkAuth, getOrderById);
orderRouter.put("/cancel/:id", checkAuth, cancelOrder);

// Admin Routes
orderRouter.put("/status/:id", checkAuth, checkAdmin, updateOrderStatus);

export default orderRouter;