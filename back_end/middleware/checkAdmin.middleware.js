import User from "../models/user.model.js";

export const checkAdmin = async (req, res, next) => {
    try {
        // req.userId was already attached by checkAuth middleware
        // We just need to look up that user and check their role
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found."
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied. Admins Only."
            });
        }

        // User is admin — let the request continue
        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};