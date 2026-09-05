import express from "express";
import { getSellerDashboardStats } from "../controllers/seller.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";
import { checkSeller } from "../middleware/checkSeller.middleware.js";

const sellerRouter = express.Router();

sellerRouter.get("/dashboard", checkAuth, checkSeller, getSellerDashboardStats);

export default sellerRouter;
