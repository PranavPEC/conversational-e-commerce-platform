import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import useToast from "../../utils/useToast.js";

// ── Validations ──
import { checkIsEmpty, isValidEmail } from "../../utils/validations.js";

// ── Child Components ──
import Toast from "../../components/common_components/Toast.jsx";
import BrandLogo from "../../components/common_components/BrandLogo.jsx";
import ForgotPasswordForm from "./ForgotPasswordForm.jsx";

function ForgotPassword() {
    const navigate = useNavigate();

    const { toast, toastVisible, showToast, dismissToast } = useToast();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // ── Validations ──
    const _checkValidations = () => {
        if (checkIsEmpty(email)) {
            showToast("Please enter your email.");
            return false;
        }

        if (!isValidEmail(email)) {
            showToast("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    // ── Submit Handler ──
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!_checkValidations()) return;

        setLoading(true);

        try {
            // Backend API will be connected in the next step
            console.log(email);

            navigate("/verify-otp", {
                state: { email },
            });
        } catch (error) {
            console.log(error);
            showToast("Something went wrong.");
        } finally {
            setLoading(false);
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
                        <Mail size={22} className="text-emerald-400" />
                    </div>

                    <div>
                        <h1 className="text-white text-2xl font-bold tracking-tight">
                            Forgot Password
                        </h1>

                        <p className="text-zinc-400 text-sm">
                            Enter your registered email address
                        </p>
                    </div>
                </div>

                <ForgotPasswordForm
                    email={email}
                    setEmail={setEmail}
                    handleSendOTP={handleSendOTP}
                    loading={loading}
                />

                <p
                    onClick={() => navigate("/login")}
                    className="text-center text-sm text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 mt-6"
                >
                    ← Back to Login
                </p>

            </div>
        </div>
    );
}

export default ForgotPassword;