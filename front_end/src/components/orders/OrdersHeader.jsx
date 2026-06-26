import React from 'react'

// Props:
//   count — total number of orders (orders.length from Orders.jsx)

function OrdersHeader({ count }) {
    return (
        <div className='mb-8'>
            <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                Your purchases
            </p>
            <h1 className='text-white text-2xl font-bold tracking-tight'>
                Order History
                <span className='text-zinc-500 text-base font-normal ml-2'>
                    ({count} {count === 1 ? 'order' : 'orders'})
                </span>
            </h1>
        </div>
    )
}

export default OrdersHeader