import { useEffect, useState } from 'react'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import PrimaryButton from '../../components/common_components/PrimaryButton'
import './HeroSection.css'

const HERO_CATEGORIES = [
    'Electronics',
    'Fashion',
    'Home',
    'Beauty',
    'Accessories',
    'Audio',
    'Laptops',
    'Premium',
]

function HeroSection({
    firstName,
    onBrowse,
    onCart,
    heroShowcaseProducts = [],
    onProductClick = () => {},
}) {
    const [categoryIndex, setCategoryIndex] = useState(0)
    const [categoryVisible, setCategoryVisible] = useState(true)
    const [cardsVisible, setCardsVisible] = useState(false)

    // ── Category cycler ──
    useEffect(() => {
        const fadeMs = 300
        let fadeTimeoutId = null

        const intervalId = setInterval(() => {
            setCategoryVisible(false)
            fadeTimeoutId = setTimeout(() => {
                setCategoryIndex(prev => (prev + 1) % HERO_CATEGORIES.length)
                setCategoryVisible(true)
            }, fadeMs)
        }, 2800)

        return () => {
            clearInterval(intervalId)
            if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
        }
    }, [])

    // ── Product cards entrance animation: trigger after brief delay ──
    useEffect(() => {
        const timeout = setTimeout(() => setCardsVisible(true), 200)
        return () => clearTimeout(timeout)
    }, [])

    // ── Check if product is newest (first in sorted array) ──
    const isNewProduct = (product, index) => index === 0 && heroShowcaseProducts.length > 0

    return (
        <section className='hero-section relative w-full overflow-hidden px-6 md:px-16 py-20 md:py-28'>

            {/* ── Floating Blobs ── */}
            <div className='hero-blob hero-blob-one' />
            <div className='hero-blob hero-blob-two' />

            {/* ── Hero Layout: Two columns (desktop) or stacked (mobile) ── */}
            <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center'>

                {/* ── Left Content ── */}
                <div className='hero-content'>

                    {/* ── Eyebrow ── */}
                    <div className='flex items-center gap-2 mb-5'>
                        <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
                        <span className='text-emerald-400 text-xs font-medium tracking-widest uppercase'>
                            Smart Shopping Starts Here
                        </span>
                    </div>

                    {/* ── Main Headline ── */}
                    <h1 className='text-white text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-3'>
                        Your curated storefront, ready
                    </h1>

                    {/* ── Category Cycler ── */}
                    <h2 className='text-emerald-400 text-3xl md:text-5xl font-bold leading-tight mb-6'>
                        {/* Show simple "Ready to shop for {category}?" to respect real data availability */}
                        Ready to shop for{' '}
                        <span
                            className={`hero-category-cycler inline-block min-w-[10ch] transition-opacity duration-300 ${
                                categoryVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {HERO_CATEGORIES[categoryIndex]}
                        </span>
                        ?
                    </h2>

                    {/* ── Animated Divider ── */}
                    <div className='hero-divider' />

                    {/* ── Subtext with actual features ── */}
                    <p className='text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mb-10'>
                        Browse 8 categories, find your favorites. Secure checkout, order tracking, and instant payment via Razorpay.
                    </p>

                    {/* ── CTA Buttons ── */}
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <PrimaryButton
                            text='Browse Products'
                            icon={<ArrowRight size={16} />}
                            onClick={onBrowse}
                        />

                        <button
                            onClick={onCart}
                            className='flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border border-zinc-700 hover:border-emerald-500 hover:-translate-y-1 active:scale-95 text-white rounded-xl text-sm transition-all duration-300 cursor-pointer'
                        >
                            <ShoppingBag size={15} />
                            View Cart
                        </button>
                    </div>
                </div>

                {/* ── Right Content: Product Showcase Collage ── */}
                {heroShowcaseProducts.length > 0 && (
                    <div className='hero-showcase-container'>
                        <div className='hero-showcase-grid'>
                            {heroShowcaseProducts.map((product, index) => (
                                <div
                                    key={product._id}
                                    className={`hero-showcase-card hero-showcase-card-${index} ${
                                        cardsVisible ? 'hero-card-visible' : ''
                                    }`}
                                    onClick={() => onProductClick(product._id)}
                                >
                                    {/* ── Product Image ── */}
                                    <div className='relative w-full h-40 md:h-48 bg-zinc-800 rounded-2xl overflow-hidden mb-3 group'>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center text-zinc-500'>
                                                No Image
                                            </div>
                                        )}

                                        {/* ── "New" Badge (only on newest product) ── */}
                                        {isNewProduct(product, index) && (
                                            <div className='absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full'>
                                                New
                                            </div>
                                        )}

                                        {/* ── Hover Glow Effect ── */}
                                        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-emerald-500 rounded-2xl' />
                                    </div>

                                    {/* ── Product Info ── */}
                                    <div>
                                        <h3 className='text-white text-sm font-semibold line-clamp-2 mb-1'>
                                            {product.title}
                                        </h3>
                                        <p className='text-emerald-400 text-base font-bold'>
                                            ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </section>
    )
}

export default HeroSection