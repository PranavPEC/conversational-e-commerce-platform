import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { fetchCart, updateCart, removeCartItem, clearEntireCart, applyCoupon, removeCoupon } from '../redux/reduxActions'
import CheckoutModal from './CheckoutModal.jsx'
import { Loader } from 'lucide-react'
import PrimaryButton from '../components/common_components/PrimaryButton.jsx'
import navigationStrings from '../constants/navigationStrings/navigationStrings.js'
import { useTranslation } from 'react-i18next'
import {formatCurrency} from '../utils/CommonFunctions.js'

function Cart() {
    const { t, i18n } = useTranslation('cart')
    const isRTL = i18n.dir() === 'rtl'
    const navigate = useNavigate()
    const getProductDetailRoute = (id) => navigationStrings.PRODUCT_DETAIL.replace(':id', id)
    const [showCheckout, setShowCheckout] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [couponRemovedNotice, setCouponRemovedNotice] = useState(null)

    const { cartItems, cartLoading, itemLoading, error, pricing, couponLoading, couponError } = useSelector(state => state.cart)

    useEffect(() => {
        fetchCart().then(data => {
            if (data?.couponRemoved) setCouponRemovedNotice(data.couponRemoved)
        }).catch(() => {
            // Intentionally ignored here — cart error state is already rendered inline below.
        })
    }, [])

    const handleQuantityChange = async (productId, currentQty, change) => {
        const newQty = currentQty + change
        if (newQty < 1) {
            try {
                await removeCartItem(productId)
            } catch {
                // Intentionally ignored here — cart error state is already rendered inline below.
            }
            return
        }
        try {
            await updateCart({ productId, quantity: newQty })
        } catch {
            // Intentionally ignored here — cart error state is already rendered inline below.
        }
    }

    const handleRemove = async (productId) => {
        try {
            await removeCartItem(productId)
        } catch {
            // Intentionally ignored here — cart error state is already rendered inline below.
        }
    }
    const handleClearCart = async () => {
        try {
            await clearEntireCart()
        } catch {
            // Intentionally ignored here — cart error state is already rendered inline below.
        }
    }
    const handleApplyCoupon = async (event) => {
        event.preventDefault()
        try {
            await applyCoupon(couponCode)
            setCouponCode('')
            setCouponRemovedNotice(null)
        } catch {
            // Intentionally ignored here — couponError is rendered in the summary.
        }
    }
    const handleRemoveCoupon = async () => {
        try {
            await removeCoupon()
        } catch {
            // Intentionally ignored here — couponError is rendered in the summary.
        }
    }

    if (cartLoading) {
        return (
            <div className='w-full min-h-screen bg-[var(--color-bg)] flex justify-center items-center'>
                <p className='text-zinc-400 text-sm'>{t("loading_cart")}</p>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className='w-full min-h-screen bg-[var(--color-bg)] flex flex-col justify-center items-center gap-4'>
                {couponRemovedNotice && (
                    <p className='text-amber-400 text-sm text-center'>{t('coupon_removed_notice', { reason: couponRemovedNotice })}</p>
                )}
                <p className='text-white text-lg font-medium'>{t("cart_empty")}</p>
                <p className='text-zinc-400 text-sm'>{t("cart_empty_description")}</p>
                <button
                    onClick={() => navigate(navigationStrings.PRODUCTS)}
                    className='mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                >
                    {t("browse_products")}
                </button>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>

            {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}

            <div className='max-w-3xl mx-auto flex items-center justify-between mb-8'>
                <h1 className='text-white text-2xl font-semibold tracking-tight'>
                    {t("your_cart")}
                    <span className='text-zinc-500 text-base font-normal ml-2'>
                        ({cartItems.length} {cartItems.length === 1 ? t("item_singular") : t("item_plural")})
                    </span>
                </h1>
                <button
                    onClick={handleClearCart}
                    className='text-sm text-zinc-500 hover:text-red-400 transition-colors duration-200 cursor-pointer'
                >
                    {t("clear_cart")}
                </button>
            </div>

            {error && (
                <div className='max-w-3xl mx-auto mb-4'>
                    <p className='text-red-400 text-sm'>{error}</p>
                </div>
            )}
            {couponRemovedNotice && (
                <div className='max-w-3xl mx-auto mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3'>
                    <p className='text-amber-300 text-sm'>{t('coupon_removed_notice', { reason: couponRemovedNotice })}</p>
                    <button onClick={() => setCouponRemovedNotice(null)} className='text-amber-300 hover:text-white' aria-label='Dismiss'>
                        ×
                    </button>
                </div>
            )}

            <div className='max-w-3xl mx-auto flex flex-col gap-4'>

                {cartItems.map((item) => {
                    const isItemLoading = itemLoading[item.product._id] || false

                    return (
                        <div key={item.product._id} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-center'>

                            <div
                                onClick={() => navigate(getProductDetailRoute(item.product._id))}
                                className='w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 cursor-pointer'
                            >
                                {item.product.image ? (
                                    <img src={item.product.image} alt={item.product.title} className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-zinc-600 text-xs'>{t("no_image")}</div>
                                )}
                            </div>

                            <div className='flex-1 flex flex-col gap-1'>
                                <h2
                                    onClick={() => navigate(getProductDetailRoute(item.product._id))}
                                    className='text-white text-sm font-medium cursor-pointer hover:text-emerald-400 transition-colors duration-200'
                                >
                                    {item.product.title}
                                </h2>
                                <p className='text-emerald-400 text-sm font-semibold'>{formatCurrency(item.product.price, isRTL)}</p>
                            </div>

                            <div className='flex items-center gap-3'>
                                <button
                                    onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                    disabled={isItemLoading}
                                    className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center'
                                >
                                    {isItemLoading ? <Loader size={10} className='animate-spin' /> : '-'}
                                </button>
                                <span className='text-white font-medium w-5 text-center text-sm'>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.product._id, item.quantity, +1)}
                                    disabled={isItemLoading}
                                    className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center'
                                >
                                    {isItemLoading ? <Loader size={10} className='animate-spin' /> : '+'}
                                </button>
                            </div>

                            <div className='w-24 text-right'>
                                <p className='text-white text-sm font-semibold'>{formatCurrency(item.product.price * item.quantity, isRTL)}</p>
                            </div>

                            <button
                                onClick={() => handleRemove(item.product._id)}
                                disabled={isItemLoading}
                                className='text-zinc-600 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 text-lg ml-2 cursor-pointer'
                            >
                                ✕
                            </button>
                        </div>
                    )
                })}

                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-4 flex flex-col gap-4'>
                    {pricing.couponCode ? (
                        <div className='flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3'>
                            <span className='text-emerald-300 text-sm font-medium'>{pricing.couponCode}</span>
                            <button
                                type='button'
                                onClick={handleRemoveCoupon}
                                disabled={couponLoading}
                                className='text-sm text-zinc-300 hover:text-white disabled:opacity-50 cursor-pointer'
                            >
                                {t('remove_coupon')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleApplyCoupon} className='flex flex-col gap-2'>
                            <label htmlFor='coupon-code' className='text-zinc-300 text-sm font-medium'>{t('have_coupon')}</label>
                            <div className='flex gap-2'>
                                <input
                                    id='coupon-code'
                                    type='text'
                                    value={couponCode}
                                    onChange={event => setCouponCode(event.target.value)}
                                    placeholder={t('coupon_code_placeholder')}
                                    disabled={couponLoading}
                                    className='min-w-0 flex-1 h-11 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm disabled:opacity-60'
                                />
                                <button
                                    type='submit'
                                    disabled={couponLoading || !couponCode.trim()}
                                    className='px-4 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                >
                                    {couponLoading ? t('applying') : t('apply')}
                                </button>
                            </div>
                        </form>
                    )}
                    {couponError && <p className='text-red-400 text-sm'>{couponError}</p>}
                    <div className='flex justify-between items-center'>
                        <span className='text-zinc-400 text-sm'>{t("subtotal")}</span>
                        <span className='text-white text-sm'>{formatCurrency(pricing.subtotal, isRTL)}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-zinc-400 text-sm'>{t("shipping")}</span>
                        <span className='text-emerald-400 text-sm'>{t("free")}</span>
                    </div>
                    <div className='h-px bg-zinc-800' />
                    {pricing.discountAmount > 0 && (
                        <div className='flex justify-between items-center'>
                            <span className='text-zinc-400 text-sm'>{t("discount")} {pricing.couponCode && `(${pricing.couponCode})`}</span>
                            <span className='text-emerald-400 text-sm'>−{formatCurrency(pricing.discountAmount, isRTL)}</span>
                        </div>
                    )}
                    <div className='flex justify-between items-center'>
                        <span className='text-white font-semibold'>{t("total")}</span>
                        <span className='text-emerald-400 text-xl font-bold'>{formatCurrency(pricing.total, isRTL)}</span>
                    </div>
                    <PrimaryButton
                        text={t("proceed_to_checkout")}
                        onClick={() => setShowCheckout(true)}
                        className='w-full mt-2'
                    />
                    <button
                        onClick={() => navigate(navigationStrings.PRODUCTS)}
                        className='w-full text-center text-zinc-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t("continue_shopping")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
