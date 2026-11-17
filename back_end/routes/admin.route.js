import express from "express";
import { getDashboardStats, getSellerApplications, updateSellerStatus } from "../controllers/admin.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";
import { checkAdmin } from "../middleware/checkAdmin.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", checkAuth, checkAdmin, getDashboardStats);
adminRouter.get("/sellers", checkAuth, checkAdmin, getSellerApplications);
adminRouter.put("/sellers/:id/status", checkAuth, checkAdmin, updateSellerStatus);

export default adminRouter;