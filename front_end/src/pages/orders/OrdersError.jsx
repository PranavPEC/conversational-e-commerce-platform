import React from 'react'

// Props:
//   error    — error string from ordersError in Redux
//   onRetry  — re-dispatches fetchUserOrders (defined in Orders.jsx)

function OrdersError({ error, onRetry }) {
    return (
        <div className='w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 px-6'>
            <p className='text-red-400 text-sm'>{error}</p>
            <button
                onClick={onRetry}
                className='px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
                Retry
            </button>
        </div>
    )
}

export default OrdersError