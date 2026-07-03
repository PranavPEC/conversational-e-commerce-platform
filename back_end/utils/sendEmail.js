import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (email, otp) => {
    const mailOptions = {
        from: `"ShopAI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "ShopAI Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
                
                <h2 style="color:#10b981; text-align:center;">
                    ShopAI Password Reset
                </h2>

                <p>Hello,</p>

                <p>
                    We received a request to reset your ShopAI account password.
                </p>

                <p>
                    Use the OTP below to continue:
                </p>

                <div style="text-align:center; margin:30px 0;">
                    <span style="
                        display:inline-block;
                        background:#10b981;
                        color:white;
                        font-size:32px;
                        letter-spacing:8px;
                        padding:16px 32px;
                        border-radius:10px;
                        font-weight:bold;
                    ">
                        ${otp}
                    </span>
                </div>

                <p>
                    This OTP is valid for
                    <strong>5 minutes</strong>.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <hr>

                <p style="font-size:12px;color:gray;">
                    © ShopAI
                </p>

            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};