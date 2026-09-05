import express from "express";

import {
    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    requestReturn,
    getMySellerOrders
} from "../controllers/order.controller.js";

import { checkAuth } from "../middleware/checkAuth.user.js";
import { checkSeller } from "../middleware/checkSeller.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const orderRouter = express.Router();

// User Routes
orderRouter.post("/place", checkAuth, placeOrder);
orderRouter.get("/myorders", checkAuth, getUserOrders);
orderRouter.get("/seller/my-orders", checkAuth, checkSeller, getMySellerOrders);
orderRouter.get("/:id", checkAuth, validateObjectId(), getOrderById);
orderRouter.put("/cancel/:id", checkAuth, validateObjectId(), cancelOrder);
orderRouter.put("/return/:id", checkAuth, validateObjectId(), requestReturn);

// Seller Routes (ownership + status-transition checks happen inside the controller)
orderRouter.put("/status/:id", checkAuth, checkSeller, validateObjectId(), updateOrderStatus);

export default orderRouter;