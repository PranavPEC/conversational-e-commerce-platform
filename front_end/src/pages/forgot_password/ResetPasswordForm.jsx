import { Eye, EyeOff } from "lucide-react";
import PrimaryButton from '../../components/common_components/PrimaryButton'
import { useTranslation } from "react-i18next";
function ResetPasswordForm({
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleResetPassword,
    loading,
}) {
    const { t } = useTranslation('auth');
    return (
        <form
            onSubmit={handleResetPassword}
            className="space-y-6"
        >
            {/* New Password */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("new_password")}
                </label>

                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        placeholder={t("new_password_placeholder")}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowNewPassword(!showNewPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
                    >
                        {showNewPassword ? (
                            <Eye size={20} />
                        ) : (
                            <EyeOff size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("confirm_password")}
                </label>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        placeholder={t("confirm_password_placeholder")}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
                    >
                        {showConfirmPassword ? (
                            <Eye size={20} />
                        ) : (
                            <EyeOff size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Submit Button */}

            <PrimaryButton
                text={t("update_password")}
                type="submit"
                loading={loading}
                disabled={loading}
                LoadingText={t("updating_password")}
                className="w-full"
                textColor='text-white'
            />

        </form>
    );
}

export default ResetPasswordForm;