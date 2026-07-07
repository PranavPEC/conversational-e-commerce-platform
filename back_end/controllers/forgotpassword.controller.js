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
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If an account with this email exists, an OTP has been sent.",
            })
        }

        // ── Resend OTP Cooldown ──
        if (user.otpSentAt) {

            const secondsPassed =
                Math.floor((Date.now() - user.otpSentAt.getTime()) / 1000);

            const cooldown = 60;

            if (secondsPassed < cooldown) {

                return res.status(429).json({
                    success: false,
                    message: `Please wait ${cooldown - secondsPassed
                        } seconds before requesting another OTP.`,
                });

            }

        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.otpSentAt = new Date();
        user.otpAttempts = 0;

        await user.save();
        await sendEmail(email, otp);
        return res.status(200).json({
            success: true,
            message: "If an account with this email exists, an OTP has been sent.",
        })


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}