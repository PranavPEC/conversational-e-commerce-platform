import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { isValidPassword } from "../utils/validations.js";

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // ── Required Fields Validation ──
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide complete information.",
            });
        }

        // ── Password Validation ──

        const passwordError = isValidPassword(newPassword);
        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError,
            });
        }
        

        // ── Find User ──
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // ── OTP Validation ──
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        // ── Hash New Password ──
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;

        // ── Clear OTP ──
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpSentAt = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};