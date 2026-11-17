import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { isValidPassword } from "../utils/validations.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const resetPassword = async (req, res) => {
    try {

        const { resetToken, newPassword } = req.body;

        // ── Required Fields Validation ──
        if (!resetToken || !newPassword) {
            return sendError(res, 400, "Please provide complete information.");
        }

        // ── Password Validation ──
        const passwordError = isValidPassword(newPassword);

        if (passwordError) {
            return sendError(res, 400, passwordError);
        }

        // ── Find User Using Reset Token ──
        const user = await User.findOne({ resetToken });

        if (!user) {
            return sendError(res, 404, "Invalid or expired reset session.");
        }

        // ── Check Reset Token Expiry ──
        if (new Date() > user.resetTokenExpiry) {

            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;

            await user.save();

            return sendError(res, 400, "Reset session has expired. Please start again.");
        }

        // ── Hash New Password ──
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;

        // ── Clear Reset Token ──
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return sendSuccess(res, 200, "Password updated successfully.");

    } catch (error) {

        console.error(error);
        return sendError(res, 500, error.message, error.message);

    }
};