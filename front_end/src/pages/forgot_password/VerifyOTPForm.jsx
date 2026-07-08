
import { useRef } from "react";
import PrimaryButton from "../../components/common_components/PrimaryButton";
function VerifyOTPForm({
    otp,
    setOtp,
    handleVerifyOTP,
    handleResendOTP,
    loading,
    resendTimer
}) {
    const inputRefs = useRef([]);

    // Handle typing
    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d?$/.test(value)) return;

        const updatedOTP = [...otp];
        updatedOTP[index] = value;
        setOtp(updatedOTP);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle Backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const updatedOTP = [...otp];
                updatedOTP[index] = "";
                setOtp(updatedOTP);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    // Handle Paste
    const handlePaste = (e) => {
        e.preventDefault();

        const pastedData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedData) return;

        const updatedOTP = [...otp];

        pastedData.split("").forEach((digit, index) => {
            updatedOTP[index] = digit;
        });

        setOtp(updatedOTP);

        const lastIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    return (
        <form
            onSubmit={handleVerifyOTP}
            className="space-y-8"
        >
            {/* OTP Inputs */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-4 text-center">
                    Verification Code
                </label>

                <div
                    className="flex justify-center gap-3"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(element) =>
                                (inputRefs.current[index] = element)
                            }
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) =>
                                handleKeyDown(index, e)
                            }
                            className="w-12 h-14 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        />
                    ))}
                </div>
            </div>

            {/* Verify Button */}

            <PrimaryButton
                text="Verify OTP"
                type="submit"
                loading={loading}
                disabled={loading}
                loadingText="Verifying..."
                className="w-full"
                textColor='text-white'
            />

            {/* Resend OTP */}
            <div className="text-center">
                <p className="text-zinc-400 text-sm">
                    Didn't receive the OTP?{" "}
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0}
                        className={`font-medium transition-colors duration-200 ${resendTimer > 0
                                ? "text-zinc-500 cursor-not-allowed"
                                : "text-emerald-400 hover:text-emerald-300"
                            }`}
                    >
                        {resendTimer > 0
                            ? `Resend OTP in ${resendTimer}s`
                            : "Resend OTP"}
                    </button>
                </p>
            </div>
        </form>
    );
}

export default VerifyOTPForm;