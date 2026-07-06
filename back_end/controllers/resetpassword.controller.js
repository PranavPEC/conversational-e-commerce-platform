import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { isValidPassword } from "../utils/validations.js";

export const resetPassword = async (req, res) => {
    try {

        const { resetToken, newPassword } = req.body;

        // ── Required Fields Validation ──
        if (!resetToken || !newPassword) {
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

        // ── Find User Using Reset Token ──
        const user = await User.findOne({ resetToken });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired reset session.",
            });
        }

        // ── Check Reset Token Expiry ──
        if (new Date() > user.resetTokenExpiry) {

            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;

            await user.save();

            return res.status(400).json({
                success: false,
                message: "Reset session has expired. Please start again.",
            });
        }

        // ── Hash New Password ──
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;

        // ── Clear Reset Token ──
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

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