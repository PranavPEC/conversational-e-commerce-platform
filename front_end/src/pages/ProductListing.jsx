import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Heart } from 'lucide-react'
import { fetchProducts, fetchUserWishlist, addToWishlist, removeFromWishlist } from '../redux/reduxActions'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/CommonFunctions.js'
import navigationStrings from '../constants/navigationStrings/navigationStrings.js'

const CATEGORY_LABELS = {
  electronics: 'electronics',
  fashion: 'fashion',
  home: 'home',
  beauty: 'beauty',
  accessories: 'accessories',
  audio: 'audio',
  laptops: 'laptops',
  premium: 'premium',
  uncategorized: 'uncategorized',
}

function ProductListing() {
  const { t, i18n } = useTranslation('product')
  const isRTL = i18n.dir() === 'rtl'
  const navigate = useNavigate()
  const location = useLocation()
  const getProductDetailRoute = (id) => navigationStrings.PRODUCT_DETAIL.replace(':id', id)

  const { products, productsLoading } = useSelector(state => state.products)
  const { userData } = useSelector(state => state.auth)
  const { wishlist } = useSelector(state => state.wishlist)
  const [togglingWishlistId, setTogglingWishlistId] = useState(null)

  const wishlistedIds = useMemo(
    () => new Set(wishlist.map(item => item.product?._id).filter(Boolean)),
    [wishlist]
  )

  const searchParams = new URLSearchParams(location.search)
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  const normalizedCategory = categoryParam ? categoryParam.toLowerCase() : null
  const normalizedSearch = searchParam ? searchParam.trim() : null

  useEffect(() => {
    fetchProducts(normalizedCategory, normalizedSearch)   // plain call — no dispatch()
  }, [normalizedCategory, normalizedSearch])

  useEffect(() => {
    if (userData) fetchUserWishlist().catch(() => {})
  }, [userData])

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation()   // don't trigger the card's navigate onClick
    if (!userData) {
      navigate(navigationStrings.LOGIN)
      return
    }
    setTogglingWishlistId(productId)
    try {
      if (wishlistedIds.has(productId)) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(productId)
      }
    } catch {
      // wishlistError is already in Redux if this fails
    } finally {
      setTogglingWishlistId(null)
    }
  }

  const heading = normalizedSearch
    ? t('search_results_for', { query: normalizedSearch })
    : normalizedCategory
      ? t(CATEGORY_LABELS[normalizedCategory] || normalizedCategory)
      : t('all_products')

  if (productsLoading) {
    return (
      <div className='w-full min-h-screen bg-[var(--color-bg)] flex justify-center items-center'>
        <p className='text-zinc-400 text-sm'>{t('loading_products')}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='w-full min-h-screen bg-[var(--color-bg)] flex justify-center items-center'>
        <p className='text-zinc-400 text-sm'>
          {normalizedSearch
            ? t('no_products_match_search')
            : normalizedCategory
              ? t('no_products_in_category')
              : t('no_products_found')}
        </p>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>

      <h1 className='text-white text-2xl font-semibold tracking-tight mb-8'>
        {heading}
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(getProductDetailRoute(product._id))}
            className='relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors duration-200 flex flex-col'
          >
            <button
              onClick={(e) => handleToggleWishlist(e, product._id)}
              disabled={togglingWishlistId === product._id}
              aria-label={wishlistedIds.has(product._id) ? t('remove_from_wishlist') : t('add_to_wishlist')}
              className='absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/60'
            >
              <Heart
                size={16}
                className={wishlistedIds.has(product._id) ? 'text-red-500' : 'text-white'}
                fill={wishlistedIds.has(product._id) ? 'currentColor' : 'none'}
              />
            </button>

            <div className='w-full h-48 overflow-hidden bg-zinc-800'>
              {product.image ? (
                <img src={product.image} alt={product.title} className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-zinc-600 text-sm'>
                  {t('no_image')}
                </div>
              )}
            </div>

            <div className='p-4 flex flex-col gap-2 flex-1'>
              <h2 className='text-white text-sm font-medium leading-tight'>{product.title}</h2>
              <p className='text-zinc-400 text-xs line-clamp-2'>{product.description}</p>

              <div className='mt-auto pt-3 flex items-center justify-between'>
                <span className='text-emerald-400 font-semibold text-sm'>
                  {formatCurrency(product.price, isRTL)}
                </span>
                {product.stock === 0 ? (
                  <span className='text-xs text-red-400 font-medium'>{t('out_of_stock')}</span>
                ) : (
                  <span className='text-xs text-zinc-500'>{product.stock} {t('left')}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ProductListing