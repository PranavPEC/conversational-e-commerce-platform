import { useTranslation } from 'react-i18next'
import PrimaryButton from '../../components/common_components/PrimaryButton'
function ForgotPasswordForm({
    email,
    setEmail,
    handleSendOTP,
    loading,
}) {
    const { t } = useTranslation('auth');
    return (
        <form
            onSubmit={handleSendOTP}
            className="space-y-6"
        >
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t("email_address")}
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("registered_email_placeholder")}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
            </div>

            {/* Send OTP Button */}
            <PrimaryButton
                text={t("send_otp")}
                type="submit"
                loading={loading}
                disabled={loading}
                LoadingText={t("sending_otp")}
                className="w-full"
                textColor='text-white'
            />
        </form>
    );
}

export default ForgotPasswordForm;