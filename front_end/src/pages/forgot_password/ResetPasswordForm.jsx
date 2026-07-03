import { Eye, EyeOff, Loader } from "lucide-react";

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
    return (
        <form
            onSubmit={handleResetPassword}
            className="space-y-6"
        >
            {/* New Password */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    New Password
                </label>

                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        placeholder="Enter your new password"
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
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm Password
                </label>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm your new password"
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
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 disabled:cursor-not-allowed text-zinc-950 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader
                            size={18}
                            className="animate-spin"
                        />
                        Updating Password...
                    </>
                ) : (
                    "Update Password"
                )}
            </button>
        </form>
    );
}

export default ResetPasswordForm;