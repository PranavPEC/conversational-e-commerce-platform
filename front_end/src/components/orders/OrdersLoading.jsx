import React from 'react'

// No props — purely visual skeleton
// Shown while ordersLoading is true in Orders.jsx

function OrdersLoading() {
    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
            <div className='max-w-3xl mx-auto'>
                {/* Skeleton heading */}
                <div className='h-7 w-40 bg-zinc-800 rounded-full animate-pulse mb-8' />
                {/* Skeleton cards */}
                <div className='flex flex-col gap-4'>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3'
                        >
                            <div className='flex justify-between'>
                                <div className='h-4 w-32 bg-zinc-800 rounded-full animate-pulse' />
                                <div className='h-4 w-20 bg-zinc-800 rounded-full animate-pulse' />
                            </div>
                            <div className='h-3 w-48 bg-zinc-800 rounded-full animate-pulse' />
                            <div className='h-3 w-24 bg-zinc-800 rounded-full animate-pulse' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrdersLoading