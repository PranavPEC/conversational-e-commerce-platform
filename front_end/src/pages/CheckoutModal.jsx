import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {useTranslation} from "react-i18next"
import { X, MapPin, ArrowRight, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    resetOrder,
    fetchUserAddresses,
    fetchCart,
} from '../redux/reduxActions'
import { calculateCartTotal,formatCurrency } from '../utils/CommonFunctions.js'

function CheckoutModal({ onClose }) {
    const { t, i18n } = useTranslation('checkout')
    const isRTL = i18n.dir() === 'rtl'
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const { addresses, addressesLoading, addressesError } = useSelector(state => state.address)

    // New state keys from orderReducers — orderLoading/orderError instead of loading/error
    const { pendingOrder, orderLoading, orderError, paymentSuccess } = useSelector(state => state.order)
    const { cartItems } = useSelector(state => state.cart)

    const handleClose = () => {
        resetOrder()   // plain call — no dispatch()
        onClose()
    }

    const handleProceedToPayment = async () => {
        if (!selectedAddressId) return
        try {
            await createRazorpayOrder({ addressId: selectedAddressId })   // plain call
        } catch {
            // Intentionally ignored here — orderError is already rendered in this modal.
        }
    }

    // Ensure addresses are available when checkout opens.
    useEffect(() => {
        fetchUserAddresses().catch(() => {
            // Intentionally ignored here — addressesError / orderError are already rendered in this modal.
        })
    }, [])

    // Auto-select default address (or first address) once list is loaded.
    useEffect(() => {
        if (!addresses || addresses.length === 0) {
            setSelectedAddressId(null)
            return
        }
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0]
        setSelectedAddressId(defaultAddress._id)
    }, [addresses])

    // Open Razorpay SDK when pendingOrder is set
    useEffect(() => {
        if (!pendingOrder) return

        const options = {
            key: pendingOrder.keyId,
            amount: pendingOrder.amount,
            currency: pendingOrder.currency,
            name: "ShopAI",
            description: "Order Payment",
            order_id: pendingOrder.razorpayOrderId,

            handler: function (response) {
                verifyRazorpayPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: pendingOrder.orderId
                }).catch(() => {
                    // Intentionally ignored here — orderError is already rendered in this modal.
                })
            },

            prefill: { name: "", email: "", contact: "" },
            theme: { color: "#10b981" },
            modal: {
                ondismiss: () => resetOrder()   // plain call
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
    }, [pendingOrder])

    // Reset stale paymentSuccess on mount
    useEffect(() => {
        resetOrder()
    }, [])

    // Clear cart after successful payment
    useEffect(() => {
        if (paymentSuccess) {
            fetchCart()   // plain call
        }
    }, [paymentSuccess])

    // ── Success screen ──
    if (paymentSuccess) {
        return (
            <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md flex flex-col items-center gap-4 text-center'>
                    <div className='w-16 h-16 rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center'>
                        <CheckCircle size={32} className='text-emerald-400' />
                    </div>
                    <h2 className='text-white text-xl font-bold'>{t('payment_successful')}</h2>
                    <p className='text-zinc-400 text-sm'>{t('order_placed_processing')}</p>
                    <div className='w-full h-px bg-zinc-800 my-2' />
                    <p className='text-zinc-500 text-xs'>{t('order_confirmation')}</p>
                    <button
                        onClick={handleClose}
                        className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer mt-2'
                    >
                        {t('done')}
                    </button>
                </div>
            </div>
        )
    }

    // ── Address + summary ──
    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>
            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md flex flex-col'>

                <div className='flex items-center justify-between p-6 border-b border-zinc-800'>
                    <h2 className='text-white text-lg font-bold tracking-tight'>{t('checkout')}</h2>
                    <button onClick={handleClose} className='text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer'>
                        <X size={18} />
                    </button>
                </div>

                <div className='p-6 flex flex-col gap-5'>

                    <div className='flex flex-col gap-2'>
                        <p className='text-zinc-400 text-xs font-medium uppercase tracking-widest'>{t('order_summary')}</p>
                        <div className='bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-2 max-h-40 overflow-y-auto'>
                            {cartItems.map(item => (
                                <div key={item.product._id} className='flex items-center justify-between gap-3'>
                                    <span className='text-zinc-300 text-sm truncate flex-1'>{item.product.title}</span>
                                    <span className='text-zinc-500 text-xs flex-shrink-0'>×{item.quantity}</span>
                                    <span className='text-white text-sm font-medium flex-shrink-0'>{formatCurrency(item.product.price * item.quantity, isRTL)}</span>
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-between items-center pt-1'>
                            <span className='text-zinc-400 text-sm'>{t('total')}</span>
                            <span className='text-emerald-400 text-lg font-bold'>{formatCurrency(calculateCartTotal(cartItems), isRTL)}</span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>{t('delivery_address')}</label>
                        <div className='relative'>
                            <MapPin size={16} className='absolute left-3.5 top-3.5 text-zinc-500' />
                            <select
                                value={selectedAddressId || ''}
                                onChange={(e) => setSelectedAddressId(e.target.value)}
                                disabled={addressesLoading || addresses.length === 0}
                                className='w-full h-12 bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
                            >
                                {addresses.length === 0 ? (
                                    <option value=''>
                                        {addressesLoading ? t('loading_addresses') : t('no_saved_address')}
                                    </option>
                                ) : (
                                    addresses.map((address) => (
                                        <option key={address._id} value={address._id}>
                                            {address.fullName}, {address.line1}, {address.city}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        {addressesError && (
                            <p className='text-red-400 text-xs'>{addressesError}</p>
                        )}
                    </div>

                    {orderError && (
                        <div className='flex items-center gap-2 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-xl px-4 py-3'>
                            <AlertCircle size={15} className='text-red-400 flex-shrink-0' />
                            <p className='text-white text-sm'>{orderError}</p>
                        </div>
                    )}

                    <button
                        onClick={handleProceedToPayment}
                        disabled={orderLoading || !selectedAddressId}
                        className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
                    >
                        {orderLoading ? (
                            <><Loader size={16} className='animate-spin' />{t('processing')}</>
                        ) : (
                            <>{t('pay')} {formatCurrency(calculateCartTotal(cartItems), isRTL)} <ArrowRight size={16} /></>
                        )}
                    </button>

                    <p className='text-zinc-600 text-xs text-center'>{t('razorpay_secure')}</p>
                </div>
            </div>
        </div>
    )
}

export default CheckoutModal