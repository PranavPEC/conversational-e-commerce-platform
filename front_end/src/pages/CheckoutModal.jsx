import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, MapPin, ArrowRight, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { createRazorpayOrder, verifyRazorpayPayment } from '../features/order/orderThunks.js'
import { resetOrder } from '../features/order/orderSlice.js'
import { clearCart } from '../features/cart/cartSlice.js'

function CheckoutModal({ onClose }) {
    const dispatch = useDispatch()
    const [address, setAddress] = useState('')

    const { pendingOrder, loading, error, paymentSuccess } = useSelector(state => state.order)
    const { cartItems } = useSelector(state => state.cart)

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    // ── Clean up Redux order state when modal closes ──
    const handleClose = () => {
        dispatch(resetOrder())
        onClose()
    }

    // ── Step 1: User submits address → call our backend to create a Razorpay order ──
    const handleProceedToPayment = async () => {
        if (!address.trim()) return
        dispatch(createRazorpayOrder({ address }))
    }

    // ── Step 2: Once we have pendingOrder from Redux, open Razorpay SDK ──
    useEffect(() => {
        if (!pendingOrder) return

        const options = {
            key: pendingOrder.keyId,
            amount: pendingOrder.amount,
            currency: pendingOrder.currency,
            name: "ShopAI",
            description: "Order Payment",
            order_id: pendingOrder.razorpayOrderId,

            // ── Step 3: Razorpay calls this after user pays ──
            handler: function (response) {
                // response contains: razorpay_order_id, razorpay_payment_id, razorpay_signature
                // We send these to our backend to verify the signature
                dispatch(verifyRazorpayPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: pendingOrder.orderId
                }))
            },

            prefill: {
                name: "",
                email: "",
                contact: ""
            },

            theme: {
                color: "#10b981"   // emerald-500 — matches ShopAI brand
            },

            modal: {
                ondismiss: () => {
                    // User closed Razorpay without paying — reset to address step
                    dispatch(resetOrder())
                }
            }
        }

        // Razorpay SDK is loaded via <script> tag in index.html
        const rzp = new window.Razorpay(options)
        rzp.open()

    }, [pendingOrder])


    // ── Step 4: After verification succeeds, clear cart and show success ──
    // Reset stale paymentSuccess on mount so previous session doesn't auto-clear cart
useEffect(() => {
    dispatch(resetOrder())
}, [])

useEffect(() => {
    if (paymentSuccess) {
        dispatch(clearCart())
    }
}, [paymentSuccess])


    // ── SUCCESS STATE ──
    if (paymentSuccess) {
        return (
            <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md flex flex-col items-center gap-4 text-center'>
                    <div className='w-16 h-16 rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center'>
                        <CheckCircle size={32} className='text-emerald-400' />
                    </div>
                    <h2 className='text-white text-xl font-bold'>Payment Successful!</h2>
                    <p className='text-zinc-400 text-sm'>Your order has been placed and is being processed.</p>
                    <div className='w-full h-px bg-zinc-800 my-2' />
                    <p className='text-zinc-500 text-xs'>You'll receive a confirmation shortly. Track your orders in Order History.</p>
                    <button
                        onClick={handleClose}
                        className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer mt-2'
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    // ── ADDRESS + SUMMARY STATE ──
    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>
            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md flex flex-col'>

                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-zinc-800'>
                    <h2 className='text-white text-lg font-bold tracking-tight'>Checkout</h2>
                    <button
                        onClick={handleClose}
                        className='text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer'
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className='p-6 flex flex-col gap-5'>

                    {/* Order Summary */}
                    <div className='flex flex-col gap-2'>
                        <p className='text-zinc-400 text-xs font-medium uppercase tracking-widest'>Order Summary</p>
                        <div className='bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 max-h-40 overflow-y-auto'>
                            {cartItems.map(item => (
                                <div key={item.product._id} className='flex items-center justify-between gap-3'>
                                    <span className='text-zinc-300 text-sm truncate flex-1'>{item.product.title}</span>
                                    <span className='text-zinc-500 text-xs flex-shrink-0'>×{item.quantity}</span>
                                    <span className='text-white text-sm font-medium flex-shrink-0'>
                                        ₹{item.product.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-between items-center pt-1'>
                            <span className='text-zinc-400 text-sm'>Total</span>
                            <span className='text-emerald-400 text-lg font-bold'>₹{total}</span>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>Delivery Address</label>
                        <div className='relative'>
                            <MapPin size={16} className='absolute left-3.5 top-3.5 text-zinc-500' />
                            <textarea
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder='Enter your full delivery address...'
                                rows={3}
                                className='w-full bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-colors duration-200 resize-none'
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className='flex items-center gap-2 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-xl px-4 py-3'>
                            <AlertCircle size={15} className='text-red-400 flex-shrink-0' />
                            <p className='text-white text-sm'>{error}</p>
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handleProceedToPayment}
                        disabled={loading || !address.trim()}
                        className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className='animate-spin' />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay ₹{total}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    <p className='text-zinc-600 text-xs text-center'>
                        Secured by Razorpay · 100% safe & encrypted
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CheckoutModal
