import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const createCoupon = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || (user.role !== "admin" && user.role !== "seller")) {
            return sendError(res, 403, "Only admins and sellers can create coupons.");
        }
        if (user.role === "seller" && user.sellerStatus !== "approved") {
            return sendError(res, 403, "Your seller account must be approved before you can create vouchers.");
        }

        const { code, discountPercent, maxDiscountAmount, minCartValue, expiryDate, usageLimit } = req.body;
        if (typeof code !== "string" || !code.trim() || discountPercent == null) {
            return sendError(res, 400, "Coupon code and discount percentage are required.");
        }
        if (!Number.isFinite(Number(discountPercent)) || Number(discountPercent) < 1 || Number(discountPercent) > 100) {
            return sendError(res, 400, "Discount percentage must be between 1 and 100.");
        }

        const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
        if (existing) return sendError(res, 400, "A coupon with this code already exists.");

        const coupon = await Coupon.create({
            code: code.trim().toUpperCase(),
            createdBy: req.userId,
            scope: user.role === "admin" ? "platform" : "seller",
            seller: user.role === "seller" ? req.userId : undefined,
            discountPercent: Number(discountPercent),
            maxDiscountAmount,
            minCartValue: minCartValue === undefined ? 0 : minCartValue,
            expiryDate,
            usageLimit,
        });

        return sendSuccess(res, 201, "Coupon created successfully.", { coupon });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

export const getMyCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ createdBy: req.userId }).sort({ createdAt: -1 });
        return sendSuccess(res, 200, "Coupons Fetched Successfully.", { coupons });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

export const updateCouponStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return sendError(res, 404, "Coupon Not Found.");

        const user = await User.findById(req.userId);
        if (typeof isActive !== "boolean") {
            return sendError(res, 400, "isActive must be a boolean.");
        }
        if (!user || (coupon.createdBy.toString() !== req.userId && user.role !== "admin")) {
            return sendError(res, 403, "Unauthorized Access.");
        }
        if (isActive && user.role === "seller" && user.sellerStatus !== "approved") {
            return sendError(res, 403, "Your seller account must be approved to activate vouchers.");
        }

        coupon.isActive = isActive;
        await coupon.save();
        return sendSuccess(res, 200, "Coupon Updated.", { coupon });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return sendError(res, 404, "Coupon Not Found.");

        const user = await User.findById(req.userId);
        if (!user || (coupon.createdBy.toString() !== req.userId && user.role !== "admin")) {
            return sendError(res, 403, "Unauthorized Access.");
        }

        await coupon.deleteOne();
        return sendSuccess(res, 200, "Coupon Deleted.");
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};