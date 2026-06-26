import React from 'react'
import { ShoppingBag } from 'lucide-react'

// Props:
//   onBrowse — navigates to /products (defined in Orders.jsx)

function OrdersEmpty({ onBrowse }) {
    return (
        <div className='w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-6'>
            <div className='w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center'>
                <ShoppingBag size={28} className='text-zinc-600' />
            </div>
            <p className='text-white text-lg font-medium'>No orders yet</p>
            <p className='text-zinc-400 text-sm text-center max-w-xs'>
                You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button
                onClick={onBrowse}
                className='mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
                Browse Products
            </button>
        </div>
    )
}

export default OrdersEmpty