import User from "../models/user.model.js";

export const verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};