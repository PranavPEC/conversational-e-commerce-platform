import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../../features/products/productThunks.js'

// ── Home components ──
import HeroSection from './HeroSection.jsx'
import PerksBar from './PerksBar.jsx'
import FeaturedProducts from './FeaturedProducts.jsx'
import SocialProofBanner from './SocialProofBanner.jsx'

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.auth)
    const { products, loading } = useSelector(state => state.products)

    // Fetch all products on mount — FeaturedProducts shows first 4
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    // First name only — "Pranav Singh" → "Pranav"
    const firstName = userData?.name?.split(' ')[0] || 'there'

    // Slice here so FeaturedProducts stays a pure display component
    const featured = products.slice(0, 4)

    return (
        <div className='w-full min-h-screen bg-zinc-950'>

            <HeroSection
                firstName={firstName}
                onBrowse={() => navigate('/products')}
                onCart={() => navigate('/cart')}
            />

            <PerksBar />

            <FeaturedProducts
                featured={featured}
                loading={loading}
                onProductClick={(id) => {
                    if (userData) {
                        navigate('/product/' + id)
                    } else {
                        navigate('/login')
                    }
                }}
                onSeeAll={() => navigate('/products')}
            />

            <SocialProofBanner
                onShopNow={() => navigate('/products')}
            />

        </div>
    )
}

export default Home
