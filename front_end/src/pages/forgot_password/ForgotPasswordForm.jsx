import { Loader } from "lucide-react";

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
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 disabled:cursor-not-allowed text-zinc-950 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader size={18} className="animate-spin" />
                        Sending OTP...
                    </>
                ) : (
                    "Send OTP"
                )}
            </button>
        </form>
    );
}

export default ForgotPasswordForm;