import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import useToast from "../../utils/useToast.js";
import { verifyOTP, forgotPassword } from "../../redux/reduxActions/authActions.js";

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
    const [resendTimer, setResendTimer] = useState(60);



    // Redirect if user directly opens this page

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    if (!email) {
        return null;
    }

    useEffect(() => {
        if (resendTimer <= 0) return;

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendTimer]);

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
        e?.preventDefault();

        if (!_checkValidations()) return;

        setLoading(true);

        try {
            const enteredOTP = otp.join("");

            const response = await verifyOTP({
                email,
                otp: enteredOTP,
            });


            setTimeout(() => {
                navigate("/reset-password", {
                    state: {
                        resetToken: response.resetToken,
                        successMessage: response.message,
                    },
                });
            }, 1000);

        } catch (error) {

            if (error.response) {
                showToast(error.response.data.message);
            } else {
                showToast("Server not reachable.");
            }

        } finally {
            setLoading(false);
        }
    };

    // ── AutoSubmit OTP ──

    useEffect(() => {

    const enteredOTP = otp.join("");

    if (
        enteredOTP.length === 6 &&
        !otp.includes("") &&
        !loading
    ) {

        handleVerifyOTP();

    }

}, [otp]);

    // ── Resend OTP ──
    const handleResendOTP = async () => {
        try {

            const response = await forgotPassword({ email });

            showToast(response.message,"success");
            setResendTimer(60);
        } catch (error) {

            if (error.response) {
                showToast(error.response.data.message);
            } else {
                showToast("Server not reachable.");
            }

        }
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
                    resendTimer={resendTimer}
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