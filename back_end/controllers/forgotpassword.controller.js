import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const forgotPassword = async (req, res) => {
    //console.log("Forgot Password Controller Hits.")
    try {
        //console.log("Entered Forgot Password Controller try Block.")
        const { email } = req.body;
        if (!email) {
            return sendError(res, 400, "Email is Required")
        }
        const user = await User.findOne({ email });

        if (!user) {
            return sendSuccess(res, 200, "If an account with this email exists, an OTP has been sent.")
        }

        // ── Resend OTP Cooldown ──
        if (user.otpSentAt) {

            const secondsPassed =
                Math.floor((Date.now() - user.otpSentAt.getTime()) / 1000);

            const cooldown = 60;

            if (secondsPassed < cooldown) {

                return sendError(res, 429, `Please wait ${cooldown - secondsPassed
                    } seconds before requesting another OTP.`);

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
        return sendSuccess(res, 200, "If an account with this email exists, an OTP has been sent.")


    }
    catch (error) {
        console.error(error);
        return sendError(res, 500, error.message, error.message);
    }
}