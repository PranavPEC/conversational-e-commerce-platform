import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import useToast from "../../utils/useToast.js";

// ── Validations ──
import {
    checkIsEmpty,
    isValidPassword,
} from "../../utils/validations.js";

// ── Redux Action ──
import { resetPassword } from "../../redux/reduxActions/authActions.js";

// ── Child Components ──
import Toast from "../../components/common_components/Toast.jsx";
import BrandLogo from "../../components/common_components/BrandLogo.jsx";
import ResetPasswordForm from "./ResetPasswordForm.jsx";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    const { toast, toastVisible, showToast, dismissToast } = useToast();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    // Prevent direct access

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password");
        }
    }, [email, otp, navigate]);

    if (!email || !otp) {
        return null;
    }

    // ── Validations ──
    const _checkValidations = () => {

        if (checkIsEmpty(newPassword)) {
            showToast("Please enter your new password.");
            return false;
        }

        if (!isValidPassword(newPassword)) {
            showToast(
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
            );
            return false;
        }

        if (checkIsEmpty(confirmPassword)) {
            showToast("Please confirm your password.");
            return false;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.");
            return false;
        }

        return true;
    };

    // ── Submit Handler ──
    const handleResetPassword = async (e) => {

        e.preventDefault();

        if (!_checkValidations()) return;

        setLoading(true);

        try {

            const response = await resetPassword({
                email,
                otp,
                newPassword,
            });

            showToast(response.message);

            setTimeout(() => {
                navigate("/login");
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
                        <Lock
                            size={22}
                            className="text-emerald-400"
                        />
                    </div>

                    <div>

                        <h1 className="text-white text-2xl font-bold tracking-tight">
                            Reset Password
                        </h1>

                        <p className="text-zinc-400 text-sm">
                            Create a strong password for your account
                        </p>

                    </div>

                </div>

                <ResetPasswordForm
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    showNewPassword={showNewPassword}
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    handleResetPassword={handleResetPassword}
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

export default ResetPassword;