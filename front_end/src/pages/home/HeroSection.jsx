import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import PrimaryButton from '../../components/common_components/PrimaryButton'
import './HeroSection.css'
import { useTranslation } from 'react-i18next'

const AUTO_ADVANCE_MS = 4500
const MANUAL_PAUSE_MS = 3500

const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4
    return window.innerWidth >= 768 ? 4 : 2
}

// ── HeroSection ──
// Two-part layout:
//   1. Short banner — headline, subtext, CTA buttons
//   2. Infinite product carousel (same clone + double-RAF technique as ProductRail)
//      so visitors see real products immediately on page load.
//
// heroShowcaseProducts — passed from Home.jsx (top 8 newest products).
// onProductClick, onBrowse, onCart — navigation callbacks from Home.jsx.
// firstName — kept in signature for backward compat, not used in headline.
function HeroSection({
    firstName,
    onBrowse,
    onCart,
    heroShowcaseProducts = [],
    onProductClick = () => {},
}) {
    const products = heroShowcaseProducts
    const {i18n} = useTranslation()
    const {t}= useTranslation('home')
    const isRTL = i18n.dir() === 'rtl'
    // ── Carousel state (mirrors ProductRail exactly) ──
    const [visibleCount, setVisibleCount] = useState(getVisibleCount)
    const [currentIndex, setCurrentIndex] = useState(visibleCount)
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [isManualPaused, setIsManualPaused] = useState(false)
    const manualPauseTimeoutRef = useRef(null)

    useEffect(() => {
        const handleResize = () => setVisibleCount(getVisibleCount())
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const canCarousel = products.length > visibleCount

    // ── Reset on breakpoint / product list change ──
    useEffect(() => {
        setIsTransitionEnabled(false)
        setCurrentIndex(canCarousel ? visibleCount : 0)
        const outerRaf = requestAnimationFrame(() => {
            const innerRaf = requestAnimationFrame(() => setIsTransitionEnabled(true))
            return () => cancelAnimationFrame(innerRaf)
        })
        return () => cancelAnimationFrame(outerRaf)
    }, [visibleCount, canCarousel, products.length])

    // ── Clone list: leading clones prepended, trailing clones appended ──
    const displayProducts = useMemo(() => {
        if (!canCarousel) return products
        return [
            ...products.slice(-visibleCount),
            ...products,
            ...products.slice(0, visibleCount),
        ]
    }, [products, canCarousel, visibleCount])

    const pauseAfterManualInteraction = () => {
        setIsManualPaused(true)
        if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current)
        manualPauseTimeoutRef.current = setTimeout(() => setIsManualPaused(false), MANUAL_PAUSE_MS)
    }

    useEffect(() => {
        return () => { if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current) }
    }, [])

    const moveNext = (fromManual = false) => {
        if (!canCarousel) return
        if (fromManual) pauseAfterManualInteraction()
        setCurrentIndex(prev => prev + visibleCount)
    }

    const movePrev = () => {
        if (!canCarousel) return
        pauseAfterManualInteraction()
        setCurrentIndex(prev => prev - visibleCount)
    }

    // ── Auto-advance ──
    useEffect(() => {
        if (!canCarousel || isHovered || isManualPaused) return
        const id = setInterval(() => setCurrentIndex(prev => prev + visibleCount), AUTO_ADVANCE_MS)
        return () => clearInterval(id)
    }, [canCarousel, isHovered, isManualPaused, visibleCount])

    // ── Seamless loop: same double-RAF technique as ProductRail ──
    const handleTransitionEnd = (e) => {
        if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
        if (!canCarousel) return
        const count = products.length
        if (count === 0) return
        if (currentIndex >= count + visibleCount || currentIndex < visibleCount) {
            const normalized =
                ((currentIndex - visibleCount) % count + count) % count + visibleCount
            setIsTransitionEnabled(false)
            setCurrentIndex(normalized)
            requestAnimationFrame(() => requestAnimationFrame(() => setIsTransitionEnabled(true)))
        }
    }

    const slideWidth = 100 / visibleCount
    const trackTranslate = isRTL ? `translateX(${currentIndex * slideWidth}%)` : `translateX(-${currentIndex * slideWidth}%)`

    const productCount = products.length
    const logicalIndex = canCarousel
        ? ((currentIndex - visibleCount) % Math.max(productCount, 1) + Math.max(productCount, 1)) % Math.max(productCount, 1)
        : 0
    const pageCount = productCount > 0 ? Math.ceil(productCount / visibleCount) : 0
    const activePage = pageCount > 0 ? Math.floor(logicalIndex / visibleCount) % pageCount : 0

    return (
        <section className='hero-section w-full border-b border-[var(--color-border)]'>
            <div className='max-w-5xl mx-auto px-6 md:px-16 py-12 md:py-16'>

                {/* ── Banner text + CTAs ── */}
                <div className='hero-content mb-10'>
                    <div className='flex items-center gap-2 mb-4'>
                        <div className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                        <span className='text-emerald-500 text-xs font-semibold tracking-widest uppercase'>
                            ShopAI
                        </span>
                    </div>

                    <h1 className='hero-headline text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-3'>
                        {t('hero_headline')}
                    </h1>

                    <p className='hero-subtext text-base leading-relaxed max-w-xl mb-8'>
                        {t('hero_subtext')}
                    </p>

                    <div className='flex flex-col sm:flex-row gap-3'>
                        <PrimaryButton
                            text={t('shop_now')}
                            icon={<ArrowRight size={16} />}
                            onClick={onBrowse}
                        />
                        <button
                            onClick={onCart}
                            className='flex items-center justify-center gap-2 px-7 py-3.5 border border-[var(--color-border)] hover:border-emerald-500 hover:-translate-y-1 active:scale-95 text-[var(--color-text-primary)] rounded-xl text-sm bg-transparent transition-all duration-300 cursor-pointer'
                        >
                            <ShoppingBag size={15} />
                            {t('view_cart')}
                        </button>
                    </div>
                </div>

                {/* ── Product carousel — visible immediately on load ── */}
                {products.length > 0 && (
                    <>
                        {/* Rail header */}
                        <div className='flex items-center justify-between mb-4'>
                            <div>
                                <p className='text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-0.5'>
                                    {t('new_in')}
                                </p>
                                <h2 className='hero-headline text-xl font-bold tracking-tight'>
                                    {t('trending_now')}
                                </h2>
                            </div>
                            <button
                                onClick={onBrowse}
                                className='flex items-center gap-1 text-[var(--color-text-muted)] hover:text-emerald-500 text-sm transition-colors duration-200 cursor-pointer'
                            >
                                {t('see_all')} <ChevronRight size={15} />
                            </button>
                        </div>

                        {/* Track + arrows */}
                        <div
                            className='relative'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {canCarousel && (
                                <>
                                    <button
                                        onClick={movePrev}
                                        aria-label={t('previous')}
                                        className='absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-emerald-500 hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center cursor-pointer'
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => moveNext(true)}
                                        aria-label={t('next')}
                                        className='absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-emerald-500 hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center cursor-pointer'
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}

                            <div className='overflow-hidden'>
                                <div
                                    className='flex'
                                    style={{
                                        transform: trackTranslate,
                                        transition: isTransitionEnabled ? 'transform 520ms ease-in-out' : 'none',
                                    }}
                                    onTransitionEnd={handleTransitionEnd}
                                >
                                    {displayProducts.map((product, index) => (
                                        <div
                                            key={`${product._id}-${index}`}
                                            style={{ flex: `0 0 ${slideWidth}%`, maxWidth: `${slideWidth}%` }}
                                            className='px-2'
                                        >
                                            <div
                                                onClick={() => onProductClick(product._id)}
                                                className='group bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 h-full'
                                            >
                                                {/* Image */}
                                                <div className='relative w-full h-44 overflow-hidden bg-[var(--color-input-bg)]'>
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.title}
                                                            className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                                                        />
                                                    ) : (
                                                        <div className='w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs'>
                                                            {t('no_image')}
                                                        </div>
                                                    )}
                                                    <div className='absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center'>
                                                        <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                                                            <Eye size={16} /> {t('view_details')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product info */}
                                                <div className='p-4 flex flex-col gap-1.5 flex-1'>
                                                    <h3 className='text-[var(--color-text-primary)] text-sm font-medium leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-emerald-500'>
                                                        {product.title}
                                                    </h3>
                                                    <div className='mt-auto pt-2 flex items-center justify-between'>
                                                        <span className='text-emerald-500 font-semibold text-sm'>
                                                            {product.price != null
                                                                ? '\u20B9' + product.price.toLocaleString('en-IN')
                                                                : t('not_available')}
                                                        </span>
                                                        {product.stock === 0 ? (
                                                            <span className='text-xs text-red-400'>{t('out_of_stock')}</span>
                                                        ) : (
                                                            <span className='text-xs text-[var(--color-text-muted)]'>
                                                                {t('items_left', { count: product.stock })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dot indicators */}
                            {canCarousel && pageCount > 1 && (
                                <div className='flex items-center justify-center gap-2 mt-5'>
                                    {Array.from({ length: pageCount }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                pauseAfterManualInteraction()
                                                setCurrentIndex(visibleCount + i * visibleCount)
                                            }}
                                            aria-label={`${t('go_to_slide')} ${i + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                activePage === i
                                                    ? 'w-6 bg-emerald-500'
                                                    : 'w-2 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

            </div>
        </section>
    )
}

export default HeroSection
