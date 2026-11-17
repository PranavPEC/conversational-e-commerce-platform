import { useTranslation } from 'react-i18next'
// Props:
//   error    — error string from wishlistError in Redux
//   onRetry  — re-dispatches fetchUserWishlist (defined in Wishlist.jsx)

function WishlistError({ error, onRetry }) {
    const { t } = useTranslation('wishlist')
    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-3 px-6'>
            <p className='text-red-400 text-sm'>{error}</p>
            <button
                onClick={onRetry}
                className='px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
                {t('retry')}
            </button>
        </div>
    )
}

export default WishlistError