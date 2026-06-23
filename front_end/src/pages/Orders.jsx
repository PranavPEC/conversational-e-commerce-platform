import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { fetchUserOrders, cancelOrder } from '../features/order/orderThunks.js'
import { formatDate } from '../../utils/CommonFunctions.js'
// ── Status config — each order status gets a colour + icon + label ──
// Adding new status later just means adding one entry here
const STATUS_CONFIG = {
    placed: {
        label: 'Order Placed',
        icon: Clock,
        color: 'text-blue-400',
        bg: 'bg-blue-400 bg-opacity-10',
        border: 'border-blue-400 border-opacity-30',
    },
    shipped: {
        label: 'Shipped',
        icon: Truck,
        color: 'text-amber-400',
        bg: 'bg-amber-400 bg-opacity-10',
        border: 'border-amber-400 border-opacity-30',
    },
    delivered: {
        label: 'Delivered',
        icon: CheckCircle,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400 bg-opacity-10',
        border: 'border-emerald-400 border-opacity-30',
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-400 bg-opacity-10',
        border: 'border-red-400 border-opacity-30',
    },
}

// ── Formats "2025-01-15T10:30:00Z" → "15 Jan 2025" ──
// const formatDate = (dateStr) => {
//     return new Date(dateStr).toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//     })
// }

function Orders() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { orders, ordersLoading, ordersError } = useSelector(state => state.order)

    // Fetch orders on mount — same pattern as fetchCart in Cart.jsx
    useEffect(() => {
        dispatch(fetchUserOrders())
    }, [dispatch])

    // ── Loading skeleton — same animate-pulse pattern as Home.jsx ──
    if (ordersLoading) {
        return (
            <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
                <div className='max-w-3xl mx-auto'>
                    <div className='h-7 w-40 bg-zinc-800 rounded-full animate-pulse mb-8' />
                    <div className='flex flex-col gap-4'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3'>
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

    // ── Empty state ──
    if (!ordersLoading && orders.length === 0) {
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
                    onClick={() => navigate('/products')}
                    className='mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                >
                    Browse Products
                </button>
            </div>
        )
    }

    // ── Error state ──
    if (ordersError) {
        return (
            <div className='w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 px-6'>
                <p className='text-red-400 text-sm'>{ordersError}</p>
                <button
                    onClick={() => dispatch(fetchUserOrders())}
                    className='px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors duration-200'
                >
                    Retry
                </button>
            </div>
        )
    }

    // ── Orders list ──
    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
            <div className='max-w-3xl mx-auto'>

                {/* Page header */}
                <div className='mb-8'>
                    <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                        Your purchases
                    </p>
                    <h1 className='text-white text-2xl font-bold tracking-tight'>
                        Order History
                        <span className='text-zinc-500 text-base font-normal ml-2'>
                            ({orders.length} {orders.length === 1 ? 'order' : 'orders'})
                        </span>
                    </h1>
                </div>

                {/* Order cards */}
                <div className='flex flex-col gap-4'>
                    {orders.map(order => {
                        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed
                        const StatusIcon = statusCfg.icon

                        return (
                            <div
                                key={order._id}
                                className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-200'
                            >
                                {/* Order header row */}
                                <div className='flex items-center justify-between px-5 py-4 border-b border-zinc-800'>

                                    {/* Left — order ID + date */}
                                    <div className='flex flex-col gap-0.5'>
                                        <div className='flex items-center gap-2'>
                                            <Package size={13} className='text-zinc-500' />
                                            <span className='text-zinc-400 text-xs font-mono'>
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                        </div>
                                        <p className='text-zinc-500 text-xs'>{formatDate(order.createdAt)}</p>
                                    </div>

                                    {/* Right — status badge */}
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}>
                                        <StatusIcon size={12} />
                                        {statusCfg.label}
                                    </div>
                                </div>

                                {/* Products list */}
                                <div className='px-5 py-4 flex flex-col gap-3'>
                                    {order.products.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className='flex items-center gap-3 cursor-pointer'
                                            onClick={() => navigate('/product/' + item.product._id)}
                                        >
                                            {/* Product image */}
                                            <div className='w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0'>
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.title}
                                                        className='w-full h-full object-cover'
                                                    />
                                                ) : (
                                                    <div className='w-full h-full flex items-center justify-center'>
                                                        <Package size={16} className='text-zinc-600' />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product info */}
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-white text-sm font-medium truncate hover:text-emerald-400 transition-colors duration-200'>
                                                    {item.product.title}
                                                </p>
                                                <p className='text-zinc-500 text-xs mt-0.5'>
                                                    Qty: {item.quantity} · ₹{item.price} each
                                                </p>
                                            </div>

                                            {/* Item subtotal */}
                                            <p className='text-white text-sm font-semibold flex-shrink-0'>
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order footer — total + address */}
                                <div className='px-5 py-4 border-t border-zinc-800 flex items-center justify-between gap-4'>
                                    <div className='flex flex-col gap-0.5'>
                                        <p className='text-zinc-500 text-xs truncate max-w-xs'>
                                            📍 {order.address}
                                        </p>
                                        <p className='text-zinc-600 text-xs'>
                                            Payment: <span className={
                                                order.paymentStatus === 'paid'
                                                    ? 'text-emerald-400'
                                                    : order.paymentStatus === 'failed'
                                                    ? 'text-red-400'
                                                    : 'text-amber-400'
                                            }>
                                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                            </span>
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-4 flex-shrink-0'>
                                        {/* Cancel only available while order is still "placed"
                                            Backend enforces this too — belt and suspenders */}
                                        {order.status === 'placed' && (
                                            <button
                                                onClick={() => dispatch(cancelOrder(order._id))}
                                                className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <div className='text-right'>
                                            <p className='text-zinc-400 text-xs'>Total</p>
                                            <p className='text-emerald-400 text-base font-bold'>₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
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
