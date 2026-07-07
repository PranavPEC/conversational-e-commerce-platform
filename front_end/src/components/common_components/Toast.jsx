import {
    AlertCircle,
    CheckCircle,
    X,
} from "lucide-react";

function Toast({
    toast,
    toastVisible,
    dismissToast,
}) {

    if (!toast) return null;

    const isSuccess = toast.type === "success";

    return (
        <div
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm transition-all duration-300 ${
                isSuccess
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500 text-white"
            } ${
                toastVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-3"
            }`}
        >

            {isSuccess ? (
                <CheckCircle
                    size={18}
                    className="flex-shrink-0"
                />
            ) : (
                <AlertCircle
                    size={18}
                    className="flex-shrink-0"
                />
            )}

            <p className="text-sm font-medium flex-1">
                {toast.message}
            </p>

            <button
                onClick={dismissToast}
                className="hover:opacity-70 transition-opacity duration-150 flex-shrink-0"
            >
                <X size={15} />
            </button>

        </div>
    );
}

export default Toast;