import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
    //console.log("Forgot Password Controller Hits.")
    try {
        //console.log("Entered Forgot Password Controller try Block.")
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is Required"
            })
        }
            const user =await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found.",
                })
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
            user.otp = otp;
            user.otpExpiry = otpExpiry;

            await user.save();
            await sendEmail(email, otp);
            return res.status(200).json({
                success: true,
                message: "OTP Generated Successfully."
            })

        
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}