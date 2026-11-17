import User from "../models/user.model.js";
import crypto from "crypto";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // ── Validation ──
        if (!email || !otp) {
            return sendError(res, 400, "Email and OTP are required.");
        }

        // ── Find User ──
        const user = await User.findOne({ email });

        if (!user) {
            return sendError(res, 404, "User not found.");
        }

        // ── Check if OTP Exists ──
        if (!user.otp || !user.otpExpiry) {
            return sendError(res, 400, "No active OTP found. Please request a new OTP.");
        }

        // ── Check OTP Expiry ──
        if (new Date() > user.otpExpiry) {

            user.otp = undefined;
            user.otpExpiry = undefined;
            user.otpSentAt = undefined;
            user.otpAttempts = 0;

            await user.save();

            return sendError(res, 400, "OTP has expired. Please request a new OTP.");
        }

        // ── Verify OTP ──
        if (user.otp !== otp) {

            user.otpAttempts += 1;

            // Maximum 5 Attempts
            if (user.otpAttempts >= 5) {

                user.otp = undefined;
                user.otpExpiry = undefined;
                user.otpSentAt = undefined;
                user.otpAttempts = 0;

                await user.save();

                return sendError(res, 400, "Too many incorrect attempts. Your OTP has been invalidated. Please request a new OTP.");
            }

            await user.save();

            const attemptsLeft = 5 - user.otpAttempts;

            return sendError(res, 400, `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft > 1 ? "s" : ""} remaining.`);
        }

        // ── OTP Verified Successfully ──

        // Reset OTP attempts
        user.otpAttempts = 0;

        // Generate Temporary Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // OTP is no longer required
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpSentAt = undefined;

        await user.save();

        return sendSuccess(res, 200, "OTP verified successfully.", {
            resetToken,
        });

    } catch (error) {

        console.error(error);
        return sendError(res, 500, error.message, error.message);

    }
};