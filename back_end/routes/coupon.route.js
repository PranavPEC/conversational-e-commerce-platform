import express from "express";
import { createCoupon, getMyCoupons, updateCouponStatus, deleteCoupon } from "../controllers/coupon.controller.js";
import { checkAuth } from "../middleware/checkAuth.user.js";

const couponRouter = express.Router();

couponRouter.post("/", checkAuth, createCoupon);
couponRouter.get("/my-coupons", checkAuth, getMyCoupons);
couponRouter.put("/:id/status", checkAuth, updateCouponStatus);
couponRouter.delete("/:id", checkAuth, deleteCoupon);

export default couponRouter;