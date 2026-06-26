import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { fetchUserOrders, cancelOrder } from '../../features/order/orderThunks.js'

// ── Orders components ──
import OrdersLoading from './OrdersLoading.jsx'
import OrdersEmpty from './OrdersEmpty.jsx'
import OrdersError from './OrdersError.jsx'
import OrdersHeader from './OrdersHeader.jsx'
import OrderCard from './OrderCard.jsx'

function Orders() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { orders, ordersLoading, ordersError } = useSelector(state => state.order)

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchUserOrders())
    }, [dispatch])

    // ── Three early return states ──
    if (ordersLoading) return <OrdersLoading />
    if (!ordersLoading && orders.length === 0) return <OrdersEmpty onBrowse={() => navigate('/products')} />
    if (ordersError) return <OrdersError error={ordersError} onRetry={() => dispatch(fetchUserOrders())} />

    // ── Orders list ──
    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
            <div className='max-w-3xl mx-auto'>

                <OrdersHeader count={orders.length} />

                <div className='flex flex-col gap-4'>
                    {orders.map(order => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            onProductClick={(id) => navigate('/product/' + id)}
                            onCancel={(id) => dispatch(cancelOrder(id))}
                        />
                    ))}
                </div>

                {/* Continue Shopping */}
                <div className='mt-8 flex justify-center'>
                    <button
                        onClick={() => navigate('/products')}
                        className='flex items-center gap-2 text-zinc-400 hover:text-emerald-400 text-sm transition-colors duration-200 cursor-pointer'
                    >
                        Continue Shopping
                        <ChevronRight size={15} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Orders