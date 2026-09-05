import { useState } from 'react'
import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../utils/CommonFunctions.js'
import {formatCurrency} from '../../utils/CommonFunctions.js'

// STATUS_CONFIG stores translation keys, not user-facing text.
// Only cancelled/rejected carry visual weight (muted red) — everything else
// is plain text, since those are just progression steps, not outcomes.
const STATUS_CONFIG = {
    pending_approval: { label: 'pending_approval' },
    placed: { label: 'order_placed' },
    shipped: { label: 'shipped' },
    delivered: { label: 'delivered' },
    cancelled: { label: 'cancelled', isNegative: true },
    rejected: { label: 'rejected', isNegative: true },
    return_requested: { label: 'return_requested' },
    return_approved: { label: 'return_approved' },
    return_rejected: { label: 'return_rejected', isNegative: true },
    refunded: { label: 'refunded' },
}

const RETURN_STATUSES = ['return_requested', 'return_approved', 'return_rejected', 'refunded']

// Props:
//   order          — full order object from Redux (products populated from backend)
//   onProductClick — called with product._id, navigates to /product/:id
//   onCancel       — called with order._id, dispatches cancelOrder
//   isSellerView   — toggles seller action buttons instead of user cancel button
//   onApprove/onReject/onShip/onDeliver — seller status action callbacks
function OrderCard({
    order,
    onProductClick,
    onCancel,
    isSellerView = false,
    onApprove,
    onReject,
    onShip,
    onDeliver,
    onRequestReturn,
    onApproveReturn,
    onRejectReturn,
    onRefund,
}) {
    const { t, i18n } = useTranslation('orders')
    const isRTL = i18n.dir() === 'rtl'
    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_approval
    const [showReturnForm, setShowReturnForm] = useState(false)
    const [returnReason, setReturnReason] = useState('')

    const handleCancelReturnForm = () => {
        setShowReturnForm(false)
        setReturnReason('')
    }

    const handleSubmitReturn = () => {
        onRequestReturn?.(order._id, returnReason)
        handleCancelReturnForm()
    }

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

                <p className={`text-xs font-medium ${statusCfg.isNegative ? 'text-red-400' : 'text-zinc-400'}`}>
                    {t(statusCfg.label)}
                </p>

            </div>

            {/* ── Products ── */}
            <div className='px-5 py-4 flex flex-col gap-3'>
                {order.products.map((item, idx) => {
                    // item.product is null when the product was deleted after this order was placed
                    if (!item.product) {
                        return (
                            <div key={idx} className='flex items-center gap-3'>
                                <div className='w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 flex items-center justify-center'>
                                    <Package size={16} className='text-zinc-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-zinc-500 text-sm italic truncate'>
                                        {t('product_unavailable', 'Product no longer available')}
                                    </p>
                                    <p className='text-zinc-500 text-xs mt-0.5'>
                                        {t('qty')}: {item.quantity} · {formatCurrency(item.price, isRTL)} {t('each')}
                                    </p>
                                </div>
                                <p className='text-white text-sm font-semibold flex-shrink-0'>
                                    {formatCurrency(item.price * item.quantity, isRTL)}
                                </p>
                            </div>
                        );
                    }

                    return (
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
                                    {t('qty')}: {item.quantity} · {formatCurrency(item.price, isRTL)} {t('each')}
                                </p>
                            </div>

                            <p className='text-white text-sm font-semibold flex-shrink-0'>
                                {formatCurrency(item.price * item.quantity, isRTL)}
                            </p>
                        </div>
                    );
                })}
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

                    {!isSellerView && order.returnReason && RETURN_STATUSES.includes(order.status) && (
                        <p className='text-zinc-500 text-xs italic max-w-xs mt-1'>
                            {order.returnReason}
                        </p>
                    )}
                </div>

                <div className='flex items-center gap-4 flex-shrink-0'>

                    {isSellerView ? (
                        <div className='flex items-center gap-2'>
                            {order.status === 'pending_approval' && (
                                <>
                                    <button
                                        onClick={() => onApprove(order._id)}
                                        className='text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                    >
                                        {t('approve')}
                                    </button>
                                    <button
                                        onClick={() => onReject(order._id)}
                                        className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                    >
                                        {t('reject')}
                                    </button>
                                </>
                            )}

                            {order.status === 'placed' && (
                                <button
                                    onClick={() => onShip(order._id)}
                                    className='text-xs text-amber-400 hover:text-amber-300 border border-amber-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                >
                                    {t('mark_shipped')}
                                </button>
                            )}

                            {order.status === 'shipped' && (
                                <button
                                    onClick={() => onDeliver(order._id)}
                                    className='text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                >
                                    {t('mark_delivered')}
                                </button>
                            )}

                            {order.status === 'return_requested' && (
                                <>
                                    <button
                                        onClick={() => onApproveReturn(order._id)}
                                        className='text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                    >
                                        {t('approve_return')}
                                    </button>
                                    <button
                                        onClick={() => onRejectReturn(order._id)}
                                        className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                    >
                                        {t('reject_return')}
                                    </button>
                                </>
                            )}

                            {order.status === 'return_approved' && (
                                <button
                                    onClick={() => onRefund(order._id)}
                                    className='text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                >
                                    {t('mark_refunded')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            {(order.status === 'placed' || order.status === 'pending_approval') && (
                                <button
                                    onClick={() => onCancel(order._id)}
                                    className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                >
                                    {t('cancel_order')}
                                </button>
                            )}

                            {order.status === 'delivered' && !showReturnForm && (
                                <button
                                    onClick={() => setShowReturnForm(true)}
                                    className='text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                >
                                    {t('request_return')}
                                </button>
                            )}

                            {showReturnForm && (
                                <div className='flex flex-col gap-2 w-64'>
                                    <textarea
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        placeholder={t('return_reason_placeholder')}
                                        rows={2}
                                        className='w-full bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs transition-colors duration-200 resize-none'
                                    />
                                    <div className='flex items-center justify-end gap-2'>
                                        <button
                                            onClick={handleCancelReturnForm}
                                            className='text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            onClick={handleSubmitReturn}
                                            className='text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                                        >
                                            {t('submit_return')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className='text-right'>
                        <p className='text-zinc-400 text-xs'>
                            {t('total')}
                        </p>

                        <p className='text-emerald-400 text-base font-bold'>
                            {formatCurrency(order.totalAmount, isRTL)}
                        </p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default OrderCard