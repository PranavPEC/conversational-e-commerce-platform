import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { fetchUserWishlist, removeFromWishlist } from '../../redux/reduxActions'
import { useTranslation } from 'react-i18next'
import AccountSidebar from '../../components/common_components/AccountSidebar'
import WishlistLoading from './WishlistLoading.jsx'
import WishlistEmpty from './WishlistEmpty.jsx'
import WishlistError from './WishlistError.jsx'
import WishlistCard from './WishlistCard.jsx'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function Wishlist() {
    const { t } = useTranslation('wishlist')
    const navigate = useNavigate()
    const { wishlist, wishlistLoading, wishlistError } = useSelector(state => state.wishlist)

    // Tracks which single item is mid-removal, so only that card shows a
    // disabled/loading state instead of freezing the whole grid — same
    // "one flag per item" idea as the cart's itemLoading map, scaled down
    // to a single id since wishlist removals aren't as rapid-fire.
    const [removingId, setRemovingId] = useState(null)

    useEffect(() => {
        fetchUserWishlist().catch(() => {
            // Intentionally ignored — wishlistError is already surfaced in WishlistError.
        })
    }, [])

    const handleRemove = async (productId) => {
        setRemovingId(productId)
        try {
            await removeFromWishlist(productId)
        } catch {
            // Intentionally ignored — wishlistError is already surfaced.
        } finally {
            setRemovingId(null)
        }
    }

    const renderContent = () => {
        if (wishlistLoading) return <WishlistLoading />
        if (!wishlistLoading && wishlist.length === 0) return <WishlistEmpty onBrowse={() => navigate(navigationStrings.PRODUCTS)} />
        if (wishlistError) return <WishlistError error={wishlistError} onRetry={() => fetchUserWishlist()} />

        return (
            <>
                <div className='mb-6'>
                    <h2 className='text-white text-lg font-semibold'>{t('my_wishlist')}</h2>
                    <p className='text-zinc-500 text-sm mt-1'>{t('items_count', { count: wishlist.length })}</p>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {wishlist.map(item => (
                        <WishlistCard
                            key={item._id}
                            item={item}
                            isRemoving={removingId === item.product?._id}
                            onView={() => navigate(navigationStrings.PRODUCT_DETAIL.replace(':id', item.product?._id))}
                            onRemove={() => handleRemove(item.product?._id)}
                        />
                    ))}
                </div>

                <div className='mt-8 flex justify-center'>
                    <button
                        onClick={() => navigate(navigationStrings.PRODUCTS)}
                        className='flex items-center gap-2 text-zinc-400 hover:text-emerald-400 text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t('continue_shopping')}
                        <ChevronRight size={15} />
                    </button>
                </div>
            </>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            {/* max-w-6xl matches Profile.jsx / Orders.jsx exactly — keeps
                AccountSidebar aligned at the same horizontal position across all three */}
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-8'>

                <AccountSidebar />

                <div className='flex-1 min-w-0'>
                    {renderContent()}
                </div>

            </div>
        </div>
    )
}

export default Wishlist