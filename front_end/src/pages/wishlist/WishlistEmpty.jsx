import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// Props:
//   onBrowse — navigates to /products (defined in Wishlist.jsx)

function WishlistEmpty({ onBrowse }) {
    const { t } = useTranslation('wishlist')
    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-4 px-6'>
            <div className='w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center'>
                <Heart size={28} className='text-zinc-600' />
            </div>
            <p className='text-white text-lg font-medium'>{t('empty_wishlist')}</p>
            <p className='text-zinc-400 text-sm text-center max-w-xs'>
                {t('empty_wishlist_description')}
            </p>
            <button
                onClick={onBrowse}
                className='mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
                {t('browse_products')}
            </button>
        </div>
    )
}

export default WishlistEmpty