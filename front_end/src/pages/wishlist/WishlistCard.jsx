import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../../utils/CommonFunctions.js'
// Props:
//   item        — one wishlist document: { _id, product: {_id, title, price, image, stock}, createdAt }
//   isRemoving  — true while THIS item's remove request is in flight
//   onView      — navigates to the product's detail page
//   onRemove    — removes this item from the wishlist

function WishlistCard({ item, isRemoving, onView, onRemove }) {
    const { t, i18n } = useTranslation('wishlist')
    const isRTL = i18n.dir() === 'rtl'
    const product = item.product

    // A wishlisted product can later be deleted from the catalog by an
    // admin — the Wishlist document still exists (nothing cascades this
    // relationship), but populate() returns `product` as null in that case.
    // Guard against rendering a broken card, offer removal instead.
    if (!product) {
        return (
            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[9rem]'>
                <p className='text-zinc-500 text-xs'>{t('product_unavailable')}</p>
                <button
                    onClick={onRemove}
                    className='text-red-400 hover:text-red-300 text-xs transition-colors duration-200 cursor-pointer'
                >
                    {t('remove')}
                </button>
            </div>
        )
    }

    return (
        <div className='relative group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out hover:border-emerald-500'>

            <button
                onClick={onRemove}
                disabled={isRemoving}
                aria-label={t('remove')}
                className='absolute z-10 top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-red-500/80 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
                <X size={14} />
            </button>

            <div onClick={onView} className='relative w-full h-32 overflow-hidden bg-zinc-800 cursor-pointer'>
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center text-zinc-600 text-xs'>
                        {t('no_image')}
                    </div>
                )}
            </div>

            <div onClick={onView} className='p-3 flex flex-col gap-1 flex-1 cursor-pointer'>
                <h3 className='text-white text-sm font-medium leading-tight line-clamp-2'>
                    {product.title}
                </h3>
                <div className='mt-auto pt-1 flex items-center justify-between'>
                    <span className='text-emerald-400 font-semibold text-sm'>
                        {product.price != null ? formatCurrency(product.price, isRTL) : t('not_available')}
                    </span>
                    {product.stock === 0 && (
                        <span className='text-xs text-red-400'>{t('out_of_stock')}</span>
                    )}
                </div>
            </div>

        </div>
    )
}

export default WishlistCard