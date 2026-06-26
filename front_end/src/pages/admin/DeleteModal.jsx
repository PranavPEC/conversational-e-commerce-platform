import React from 'react'
import { Trash2, Loader } from 'lucide-react'

// Props:
//   deleteTarget — product object pending deletion (has _id and title)
//   loading      — disables confirm button during delete API call
//   onConfirm    — dispatches deleteProduct
//   onCancel     — sets deleteTarget to null, closes modal

function DeleteModal({ deleteTarget, loading, onConfirm, onCancel }) {
    if (!deleteTarget) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>
            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5'>

                {/* Icon + heading */}
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 flex items-center justify-center flex-shrink-0'>
                        <Trash2 size={16} className='text-red-400' />
                    </div>
                    <div>
                        <h3 className='text-white font-semibold'>Delete Product</h3>
                        <p className='text-zinc-400 text-sm'>This action cannot be undone.</p>
                    </div>
                </div>

                {/* Confirmation message with product name */}
                <p className='text-zinc-300 text-sm'>
                    Are you sure you want to delete{' '}
                    <span className='text-white font-medium'>"{deleteTarget.title}"</span>?
                </p>

                {/* Actions */}
                <div className='flex gap-3'>
                    <button
                        onClick={onCancel}
                        className='flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className='flex-1 h-11 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
                    >
                        {loading
                            ? <Loader size={14} className='animate-spin' />
                            : 'Delete'
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}

export default DeleteModal
