import React from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

// Inline banner — sits inside the page flow, not a fixed overlay
// This is intentionally different from Login's Toast (which is fixed top-right)
// Props:
//   success — success message string or null
//   error   — error message string or null

function AdminToast({ success, error }) {
    if (!success && !error) return null

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
            success
                ? 'bg-emerald-500 bg-opacity-10 border-emerald-500 border-opacity-30 text-emerald-400'
                : 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-30 text-red-400'
        }`}>
            {success
                ? <CheckCircle size={15} className='flex-shrink-0' />
                : <AlertCircle size={15} className='flex-shrink-0' />
            }
            <span>{success || error}</span>
        </div>
    )
}

export default AdminToast
