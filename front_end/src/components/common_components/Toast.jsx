import React from 'react'
import { AlertCircle, X } from 'lucide-react'

// Shared by Login.jsx and SignUp.jsx
// Props:
//   toast        — string message to show, null when hidden
//   toastVisible — boolean controlling opacity/translate animation
//   dismissToast — function to manually close the toast

function Toast({ toast, toastVisible, dismissToast }) {
    if (!toast) return null

    return (
        <div
            className={`fixed top-5 right-5 z-50 bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm transition-all duration-300 ${
                toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
        >
            <AlertCircle size={16} className='flex-shrink-0' />
            <p className='text-sm font-medium flex-1'>{toast}</p>
            <button
                onClick={dismissToast}
                className='hover:opacity-70 transition-opacity duration-150 flex-shrink-0'
            >
                <X size={14} />
            </button>
        </div>
    )
}

export default Toast
