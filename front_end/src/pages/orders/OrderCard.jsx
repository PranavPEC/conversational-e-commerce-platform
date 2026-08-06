import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../utils/CommonFunctions.js'

// STATUS_CONFIG stores translation keys, not user-facing text
const STATUS_CONFIG = {
    placed: {
        label: 'order_placed',
        icon: Clock,
        color: 'text-blue-400',
        bg: 'bg-blue-400 bg-opacity-10',
        border: 'border-blue-400 border-opacity-30',
    },
    shipped: {
        label: 'shipped',
        icon: Truck,
        color: 'text-amber-400',
        bg: 'bg-amber-400 bg-opacity-10',
        border: 'border-amber-400 border-opacity-30',
    },
    delivered: {
        label: 'delivered',
        icon: CheckCircle,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400 bg-opacity-10',
        border: 'border-emerald-400 border-opacity-30',
    },
    cancelled: {
        label: 'cancelled',
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-400 bg-opacity-10',
        border: 'border-red-400 border-opacity-30',
    },
}

// Props:
//   order          — full order object from Redux (products populated from backend)
//   onProductClick — called with product._id, navigates to /product/:id
//   onCancel       — called with order._id, dispatches cancelOrder

function OrderCard({ order, onProductClick, onCancel }) {
    const { t } = useTranslation('orders')

    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed
    const StatusIcon = statusCfg.icon

    const hasStructuredAddress = !!order?.address?.fullName

    const addressText = hasStructuredAddress
        ? `${order.address.fullName}, ${order.address.line1}${order.address.line2 ? `, ${order.address.line2}` : ''}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
        : (typeof order.address === 'string'
            ? order.address
            : t('address_not_available'))

    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-200'>

            {/* ── Card Header ── */}
            <div className='flex items-center justify-between px-5 py-4 border-b border-zinc-800'>

                <div className='flex flex-col gap-0.5'>
                    <div className='flex items-center gap-2'>
                        <Package size={13} className='text-zinc-500' />
                        <span className='text-zinc-400 text-xs font-mono'>
                            #{order._id.slice(-8).toUpperCase()}
                        </span>
                    </div>
                    <p className='text-zinc-500 text-xs'>
                        {formatDate(order.createdAt)}
                    </p>
                </div>

                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}
                >
                    <StatusIcon size={12} />
                    {t(statusCfg.label)}
                </div>

            </div>

            {/* ── Products ── */}
            <div className='px-5 py-4 flex flex-col gap-3'>
                {order.products.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onProductClick(item.product._id)}
                        className='flex items-center gap-3 cursor-pointer'
                    >
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


                        <div className='flex-1 min-w-0'>
                            <p className='text-white text-sm font-medium truncate hover:text-emerald-400 transition-colors duration-200'>
                                {item.product.title}
                            </p>

                            <p className='text-zinc-500 text-xs mt-0.5'>
                                {t('qty')}: {item.quantity} · ₹{item.price} {t('each')}
                            </p>
                        </div>

                        <p className='text-white text-sm font-semibold flex-shrink-0'>
                            ₹{item.price * item.quantity}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Footer ── */}
            <div className='px-5 py-4 border-t border-zinc-800 flex items-center justify-between gap-4'>

                <div className='flex flex-col gap-0.5'>
                    <p className='text-zinc-500 text-xs truncate max-w-xs'>
                        📍 {addressText}
                    </p>

                    <p className='text-zinc-600 text-xs'>
                        {t('payment')}:{' '}
                        <span
                            className={
                                order.paymentStatus === 'paid'
                                    ? 'text-emerald-400'
                                    : order.paymentStatus === 'failed'
                                        ? 'text-red-400'
                                        : 'text-amber-400'
                            }
                        >
                            {t(order.paymentStatus)}
                        </span>
                    </p>
                </div>

                <div className='flex items-center gap-4 flex-shrink-0'>

                    {order.status === 'placed' && (
                        <button
                            onClick={() => onCancel(order._id)}
                            className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                        >
                            {t('cancel_order')}
                        </button>
                    )}

                    <div className='text-right'>
                        <p className='text-zinc-400 text-xs'>
                            {t('total')}
                        </p>

                        <p className='text-emerald-400 text-base font-bold'>
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                        </p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default OrderCard