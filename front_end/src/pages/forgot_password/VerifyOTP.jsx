import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import useToast from "../../utils/useToast.js";

// ── Child Components ──
import Toast from "../../components/common_components/Toast.jsx";
import BrandLogo from "../../components/common_components/BrandLogo.jsx";
import VerifyOTPForm from "./VerifyOTPForm.jsx";

function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    // Email received from ForgotPassword.jsx
    const email = location.state?.email;

    const { toast, toastVisible, showToast, dismissToast } = useToast();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    // Redirect if user directly opens this page
    if (!email) {
        navigate("/forgot-password");
        return null;
    }

    // ── Validation ──
    const _checkValidations = () => {
        const enteredOTP = otp.join("");

        if (enteredOTP.length !== 6) {
            showToast("Please enter the complete 6-digit OTP.");
            return false;
        }

        return true;
    };

    // ── Verify OTP ──
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!_checkValidations()) return;

        setLoading(true);

        try {
            const enteredOTP = otp.join("");

            console.log({
                email,
                otp: enteredOTP,
            });

            // Backend API will come here

            navigate("/reset-password", {
                state: {
                    email,
                },
            });
        } catch (error) {
            console.log(error);
            showToast("Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP ──
    const handleResendOTP = () => {
        // Backend API will come later
        showToast("OTP sent successfully.");
    };

    return (
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-10">

            <Toast
                toast={toast}
                toastVisible={toastVisible}
                dismissToast={dismissToast}
            />

            <div className="w-full max-w-lg bg-zinc-900 rounded-3xl border border-zinc-800 p-8 md:p-10">

                <BrandLogo />

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck
                            size={22}
                            className="text-emerald-400"
                        />
                    </div>

                    <div>
                        <h1 className="text-white text-2xl font-bold tracking-tight">
                            Verify OTP
                        </h1>

                        <p className="text-zinc-400 text-sm">
                            Enter the 6-digit verification code sent to
                        </p>

                        <p className="text-emerald-400 text-sm font-medium break-all">
                            {email}
                        </p>
                    </div>
                </div>

                <VerifyOTPForm
                    otp={otp}
                    setOtp={setOtp}
                    handleVerifyOTP={handleVerifyOTP}
                    handleResendOTP={handleResendOTP}
                    loading={loading}
                />

                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-center text-sm text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 mt-6"
                >
                    ← Back
                </p>

            </div>
        </div>
    );
}

export default VerifyOTP;