import { useEffect, useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// ── New architecture: plain async function, call directly ──
import { fetchProducts, fetchUserWishlist, addToWishlist, removeFromWishlist } from '../../redux/reduxActions'

// ── Child Components ──
import HeroSection from './HeroSection.jsx'
import DealBanner from './DealBanner.jsx'
import PerksBar from './PerksBar.jsx'
import PromoBannerGrid from './PromoBannerGrid.jsx'
import SocialProofBanner from './SocialProofBanner.jsx'
import ProductRail from '../../components/common_components/ProductRail.jsx'
import useScrollReveal from '../../hooks/useScrollReveal'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function Home() {
    const navigate = useNavigate()
    const { t } = useTranslation('home')

    const { userData } = useSelector(state => state.auth)
    const { wishlist } = useSelector(state => state.wishlist)
    const [togglingWishlistId, setTogglingWishlistId] = useState(null)

    // Set lookup is O(1) per card, vs .some() re-scanning the whole array
    // for every one of the ~12 cards rendered across the three rails.
    const wishlistedIds = useMemo(
        () => new Set(wishlist.map(item => item.product?._id).filter(Boolean)),
        [wishlist]
    )
    const { products, productsLoading } = useSelector(state => state.products)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (userData) fetchUserWishlist().catch(() => { })
    }, [userData])

    const firstName = userData?.name?.split(' ')[0] || 'there'

    // ───────────────────────────────────────────────
    // Navigation callbacks (memoized)
    // ───────────────────────────────────────────────

    const handleBrowse = useCallback(() => {
        navigate(navigationStrings.PRODUCTS)
    }, [navigate])

    const handleCart = useCallback(() => {
        navigate(navigationStrings.CART)
    }, [navigate])

    const handleSeeAll = useCallback(() => {
        navigate(navigationStrings.PRODUCTS)
    }, [navigate])

    const handleProductClick = useCallback(
        (id) => {
            navigate(
                navigationStrings.PRODUCT_DETAIL.replace(':id', id)
            )
        },
        [navigate]
    )

    const handleToggleWishlist = async (productId) => {
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
            // wishlistError is already in Redux if this fails — nothing extra needed here
        } finally {
            setTogglingWishlistId(null)
        }
    }

    // ───────────────────────────────────────────────
    // Memoized rail datasets
    // ───────────────────────────────────────────────

    const featuredProducts = useMemo(() => {
        return products.slice(0, 8)
    }, [products])

    const newestProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => {
                const aTime = a?.createdAt
                    ? new Date(a.createdAt).getTime()
                    : 0

                const bTime = b?.createdAt
                    ? new Date(b.createdAt).getTime()
                    : 0

                return bTime - aTime
            })
            .slice(0, 8)
    }, [products])

    const newArrivals = newestProducts

    const heroShowcaseProducts = newestProducts

    const topDeals = useMemo(() => {
        return [...products]
            .sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0))
            .slice(0, 8)
    }, [products])

    // ───────────────────────────────────────────────
    // Scroll reveal hooks
    // ───────────────────────────────────────────────

    const [featuredRef, featuredVisible] = useScrollReveal()
    const [arrivalsRef, arrivalsVisible] = useScrollReveal()
    const [dealsRef, dealsVisible] = useScrollReveal()

    return (
        <div className="w-full min-h-screen bg-[var(--color-bg)]">

            <HeroSection
                firstName={firstName}
                onBrowse={handleBrowse}
                onCart={handleCart}
                heroShowcaseProducts={heroShowcaseProducts}
                onProductClick={handleProductClick}
                wishlistedIds={wishlistedIds}
                onToggleWishlist={handleToggleWishlist}
                togglingWishlistId={togglingWishlistId}
            />

            <DealBanner />

            <PerksBar />

            <div
                ref={featuredRef}
                className={`transition-all duration-700 ease-out ${featuredVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <ProductRail
                    title={t('featured_products')}
                    subtitle={t('handpicked_for_you')}
                    products={featuredProducts}
                    loading={productsLoading}
                    onProductClick={handleProductClick}
                    onSeeAll={handleSeeAll}
                    wishlistedIds={wishlistedIds}
                    onToggleWishlist={handleToggleWishlist}
                    togglingWishlistId={togglingWishlistId}
                />
            </div>

            <PromoBannerGrid />

            <div
                ref={arrivalsRef}
                className={`transition-all duration-700 ease-out ${arrivalsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <ProductRail
                    title={t('new_arrivals')}
                    subtitle={t('freshly_added')}
                    products={newArrivals}
                    loading={productsLoading}
                    onProductClick={handleProductClick}
                    onSeeAll={handleSeeAll}
                    wishlistedIds={wishlistedIds}
                    onToggleWishlist={handleToggleWishlist}
                    togglingWishlistId={togglingWishlistId}
                />
            </div>

            <div
                ref={dealsRef}
                className={`transition-all duration-700 ease-out ${dealsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <ProductRail
                    title={t('top_deals')}
                    subtitle={t('best_prices_right_now')}
                    products={topDeals}
                    loading={productsLoading}
                    onProductClick={handleProductClick}
                    onSeeAll={handleSeeAll}
                    wishlistedIds={wishlistedIds}
                    onToggleWishlist={handleToggleWishlist}
                    togglingWishlistId={togglingWishlistId}
                />
            </div>

            <SocialProofBanner
                onShopNow={handleBrowse}
            />

        </div>
    )
}

export default Home