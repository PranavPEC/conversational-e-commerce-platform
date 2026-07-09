import { Loader } from "lucide-react";

function PrimaryButton({
    text,
    icon = null,
    onClick,
    type = "button",
    loading = false,
    disabled = false,
    className = "",
    LoadingText = "Loading...",
    textColor = "text-white",
}) {

    const isDisabled = loading || disabled;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                group
                flex
                items-center
                justify-center
                gap-2

                px-7
                py-3.5

                bg-emerald-500
                hover:bg-emerald-400

                ${textColor}
                font-semibold
                text-sm

                rounded-xl

                transition-all
                duration-300

                hover:-translate-y-1
                active:scale-95

                disabled:bg-emerald-500/60
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                disabled:active:scale-100

                cursor-pointer

                ${className}
            `}
        >
            {loading ? (
                <>
                    <Loader
                        size={18}
                        className="animate-spin"
                    />
                    {LoadingText}
                </>
            ) : (
                <>
                    {text}

                    {icon && (
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                            {icon}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}

export default PrimaryButton;