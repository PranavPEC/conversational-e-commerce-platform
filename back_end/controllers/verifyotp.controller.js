import User from "../models/user.model.js";
import crypto from "crypto";

export const verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // ── Validation ──
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        // ── Find User ──
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // ── Check if OTP Exists ──
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "No active OTP found. Please request a new OTP."
            });
        }

        // ── Check OTP Expiry ──
        if (new Date() > user.otpExpiry) {

            user.otp = undefined;
            user.otpExpiry = undefined;
            user.otpSentAt = undefined;
            user.otpAttempts = 0;

            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
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

                return res.status(400).json({
                    success: false,
                    message:
                        "Too many incorrect attempts. Your OTP has been invalidated. Please request a new OTP."
                });
            }

            await user.save();

            const attemptsLeft = 5 - user.otpAttempts;

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft > 1 ? "s" : ""} remaining.`
            });
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

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
            resetToken,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};