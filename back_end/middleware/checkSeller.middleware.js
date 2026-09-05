import User from "../models/user.model.js";
import { sendError } from "../utils/apiResponse.js";

export const checkSeller = async (req, res, next) => {
    try {
        // req.userId was already attached by checkAuth middleware
        const user = await User.findById(req.userId);
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        if (user.role !== "seller" && user.role !== "admin") {
            return sendError(res, 403, "Access denied. Seller or Admin only.");
        }
        if (user.role === "seller" && user.sellerStatus !== "approved") {
            const message = user.sellerStatus === "pending"
                ? "Your seller account is awaiting admin approval."
                : "Your seller application was not approved. Contact support.";
            return sendError(res, 403, message);
        }
        // Attach role so downstream controllers can skip ownership checks for admins
        req.userRole = user.role;
        next();
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Internal server error");
    }
};