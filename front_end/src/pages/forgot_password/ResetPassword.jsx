import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import navigationStrings from "../../constants/navigationStrings/navigationStrings.js";

function ResetPassword() {
    const { t } = useTranslation('auth');

    const navigate = useNavigate();
    const location = useLocation();

    const resetToken = location.state?.resetToken;
    const successMessage = location.state?.successMessage;

    const { toast, toastVisible, showToast, dismissToast } = useToast();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    // Prevent direct access

    useEffect(() => {
        if (!resetToken) {
            navigate(navigationStrings.FORGOT_PASSWORD);
        }
    }, [resetToken, navigate]);

    if (!resetToken) {
        return null;
    }

    // ── Verify OTP Success Message ──

    useEffect(() => {

        if (successMessage) {
            showToast(successMessage,"success");
        }

    }, [successMessage]);

    // ── Validations ──
    const _checkValidations = () => {

        if (checkIsEmpty(newPassword)) {
            showToast(t("new_password_required"));
            return false;
        }

        if (!isValidPassword(newPassword)) {
            showToast(
                t("password_policy_error")
            );
            return false;
        }

        if (checkIsEmpty(confirmPassword)) {
            showToast(t("confirm_password_required"));
            return false;
        }

        if (newPassword !== confirmPassword) {
            showToast(t("passwords_do_not_match"));
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
                resetToken,
                newPassword,
            });

            showToast(response.message,"success");

            setTimeout(() => {
                navigate(navigationStrings.LOGIN);
            }, 1000);

        } catch (error) {

            if (error.response) {
                showToast(error.response.data.message);
            } else {
                showToast(t("server_not_reachable"));
            }

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="w-full min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6 py-10">

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
                            {t("reset_password")}
                        </h1>

                        <p className="text-zinc-400 text-sm">
                            {t("reset_password_description")}
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
                    onClick={() => navigate(navigationStrings.LOGIN)}
                    className="text-center text-sm text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 mt-6"
                >
                    {t("back_to_login")}
                </p>

            </div>

        </div>
    );
}

export default ResetPassword;