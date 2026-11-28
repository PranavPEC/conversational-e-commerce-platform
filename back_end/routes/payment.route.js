import express from "express";
import { createRazorpayOrder, verifyPayment, releaseCheckoutHold } from "../controllers/payment.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";

const paymentRouter = express.Router();

// Step 1 — Frontend requests a Razorpay order ID (this also reserves the stock)
paymentRouter.post("/create-order", checkAuth, createRazorpayOrder);

// Step 2 — Frontend sends payment proof for verification
paymentRouter.post("/verify", checkAuth, verifyPayment);

// Buyer closed the payment window without paying: give the held stock back now
paymentRouter.post("/release", checkAuth, releaseCheckoutHold);

export default paymentRouter;