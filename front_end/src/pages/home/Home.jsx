import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ── New architecture: plain async function, call directly ──
import { fetchProducts } from '../../redux/reduxActions'

// ── Child Components ──
import HeroSection from './HeroSection.jsx'
import DealBanner from './DealBanner.jsx'
import PerksBar from './PerksBar.jsx'
import PromoBannerGrid from './PromoBannerGrid.jsx'
import SocialProofBanner from './SocialProofBanner.jsx'
import ProductRail from '../../components/common_components/ProductRail.jsx'
import useScrollReveal from '../../hooks/useScrollReveal'

function Home() {
    const navigate = useNavigate()

    const { userData } = useSelector(state => state.auth)
    const { products, productsLoading } = useSelector(state => state.products)

    useEffect(() => {
        fetchProducts()   // call directly — no dispatch() wrapper
    }, [])

    const firstName = userData?.name?.split(' ')[0] || 'there'

    // ── Rail datasets ──
    const featuredProducts = products.slice(0, 4)

    // Use real creation time for New Arrivals when available (timestamps: true)
    // and gracefully fall back to array order if createdAt is missing.
    const newArrivals = [...products]
        .sort((a, b) => {
            const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0
            const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0
            return bTime - aTime
        })
        .slice(0, 4)

    const topDeals = [...products]
        .sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0))
        .slice(0, 4)

    // ── Independent scroll reveals for each rail ──
    const [featuredRef, featuredVisible] = useScrollReveal()
    const [arrivalsRef, arrivalsVisible] = useScrollReveal()
    const [dealsRef, dealsVisible] = useScrollReveal()

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)]'>

            <HeroSection
                firstName={firstName}
                onBrowse={() => navigate('/products')}
                onCart={() => navigate('/cart')}
            />

            <DealBanner />

            <PerksBar />

            <div
                ref={featuredRef}
                className={`transition-all duration-700 ease-out ${
                    featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <ProductRail
                    title='Featured Products'
                    subtitle='Handpicked for you'
                    products={featuredProducts}
                    loading={productsLoading}
                    onProductClick={(id) => navigate('/product/' + id)}
                    onSeeAll={() => navigate('/products')}
                />
            </div>

            <PromoBannerGrid />

            <div
                ref={arrivalsRef}
                className={`transition-all duration-700 ease-out ${
                    arrivalsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <ProductRail
                    title='New Arrivals'
                    subtitle='Freshly added'
                    products={newArrivals}
                    loading={productsLoading}
                    onProductClick={(id) => navigate('/product/' + id)}
                    onSeeAll={() => navigate('/products')}
                />
            </div>

            <div
                ref={dealsRef}
                className={`transition-all duration-700 ease-out ${
                    dealsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <ProductRail
                    title='Top Deals'
                    subtitle='Best prices right now'
                    products={topDeals}
                    loading={productsLoading}
                    onProductClick={(id) => navigate('/product/' + id)}
                    onSeeAll={() => navigate('/products')}
                />
            </div>

            <SocialProofBanner
                onShopNow={() => navigate('/products')}
            />

        </div>
    )
}

export default Home
