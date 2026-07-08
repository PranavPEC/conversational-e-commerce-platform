
import PrimaryButton from '../../components/common_components/PrimaryButton'
function ForgotPasswordForm({
    email,
    setEmail,
    handleSendOTP,
    loading,
}) {
    return (
        <form
            onSubmit={handleSendOTP}
            className="space-y-6"
        >
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
            </div>

            {/* Send OTP Button */}
            <PrimaryButton
                text="Send OTP"
                type="submit"
                loading={loading}
                disabled={loading}
                loadingText="Sending OTP..."
                className="w-full"
                textColor='text-white'
            />
        </form>
    );
}

export default ForgotPasswordForm;