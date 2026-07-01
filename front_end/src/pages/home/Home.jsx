import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ── New architecture: plain async function, call directly ──
import { fetchProducts } from '../../redux/reduxActions'

import HeroSection from './HeroSection.jsx'
import PerksBar from './PerksBar.jsx'
import FeaturedProducts from './FeaturedProducts.jsx'
import SocialProofBanner from './SocialProofBanner.jsx'

function Home() {
    const navigate = useNavigate()

    const { userData } = useSelector(state => state.auth)
    const { products, productsLoading } = useSelector(state => state.products)

    useEffect(() => {
        fetchProducts()   // call directly — no dispatch() wrapper
    }, [])

    const firstName = userData?.name?.split(' ')[0] || 'there'
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
                loading={productsLoading}
                onProductClick={(id) => navigate('/product/' + id)}
                onSeeAll={() => navigate('/products')}
            />

            <SocialProofBanner
                onShopNow={() => navigate('/products')}
            />

        </div>
    )
}

export default Home