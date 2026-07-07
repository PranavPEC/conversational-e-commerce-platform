import { useState } from "react";

function useToast() {

    const [toast, setToast] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);

    const showToast = (message, type = "error") => {

        setToast({
            message,
            type,
        });

        setToastVisible(false);

        setTimeout(() => setToastVisible(true), 10);
        setTimeout(() => setToastVisible(false), 2600);
        setTimeout(() => setToast(null), 3000);

    };

    const dismissToast = () => {

        setToastVisible(false);
        setTimeout(() => setToast(null), 300);

    };

    return {
        toast,
        toastVisible,
        showToast,
        dismissToast,
    };
}

export default useToast;