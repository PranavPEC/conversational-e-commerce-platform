import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";

const paymentRouter = express.Router();

// Step 1 — Frontend requests a Razorpay order ID
paymentRouter.post("/create-order", checkAuth, createRazorpayOrder);

// Step 2 — Frontend sends payment proof for verification
paymentRouter.post("/verify", checkAuth, verifyPayment);

export default paymentRouter;