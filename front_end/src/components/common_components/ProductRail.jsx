import { useEffect, useMemo, useRef, useState } from 'react'
import { ShoppingBag, ChevronRight, Eye, ChevronLeft } from 'lucide-react'

const AUTO_ADVANCE_MS = 4500
const MANUAL_PAUSE_MS = 3500

const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4
    return window.innerWidth >= 768 ? 4 : 2
}

// ── Reusable Product Rail ──
// Generic rail component shared across Home sections (Featured, New Arrivals,
// etc). Keeps the existing loading / populated / empty-state behavior exactly
// the same as the old FeaturedProducts component.
function ProductRail({ title, subtitle, products, loading, onProductClick, onSeeAll }) {
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

    // ── Reset position when breakpoint or product list changes ──
    // Double RAF: outer fires before paint, inner fires after — ensures
    // the no-transition jump is invisible before re-enabling animation.
    useEffect(() => {
        setIsTransitionEnabled(false)
        setCurrentIndex(canCarousel ? visibleCount : 0)

        const outerRaf = requestAnimationFrame(() => {
            const innerRaf = requestAnimationFrame(() => {
                setIsTransitionEnabled(true)
            })
            return () => cancelAnimationFrame(innerRaf)
        })

        return () => cancelAnimationFrame(outerRaf)
    }, [visibleCount, canCarousel, products.length])

    // ── Build display list: real items sandwiched between head/tail clones ──
    // Clone the last `visibleCount` items at the front and the first
    // `visibleCount` items at the back. When the track slides into a clone
    // zone, we silently teleport back to the matching real position.
    const displayProducts = useMemo(() => {
        if (!canCarousel) return products

        const leadingClones = products.slice(-visibleCount)
        const trailingClones = products.slice(0, visibleCount)
        return [...leadingClones, ...products, ...trailingClones]
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

    useEffect(() => {
        if (!canCarousel || isHovered || isManualPaused) return

        const intervalId = setInterval(() => {
            setCurrentIndex(prev => prev + visibleCount)
        }, AUTO_ADVANCE_MS)

        return () => clearInterval(intervalId)
    }, [canCarousel, isHovered, isManualPaused, visibleCount])

    // ── Seamless loop handler ──
    // Fires when the CSS transform transition on the TRACK element completes.
    // Two guards prevent false triggers:
    //   1. e.target !== e.currentTarget — card hover transitions bubble up
    //      from children and must be ignored (they are not the track sliding).
    //   2. e.propertyName !== 'transform' — only act on the translate, not on
    //      any other property that might transition on the same element.
    // After normalizing the index we disable transition, jump instantly, then
    // use a DOUBLE RAF so the browser actually paints the no-transition frame
    // before we re-enable animation. A single RAF re-enables too early (before
    // the paint), making the jump visible. Double RAF guarantees one paint
    // cycle with transition=none before the next animation can start.
    const handleTransitionEnd = (e) => {
        if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
        if (!canCarousel) return

        const productCount = products.length
        if (productCount === 0) return

        if (currentIndex >= productCount + visibleCount || currentIndex < visibleCount) {
            const normalizedIndex =
                ((currentIndex - visibleCount) % productCount + productCount) % productCount + visibleCount

            setIsTransitionEnabled(false)
            setCurrentIndex(normalizedIndex)

            // Outer RAF: executes before browser paints the no-transition state.
            // Inner RAF: executes after that paint — safe to re-enable transition.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitionEnabled(true)
                })
            })
        }
    }

    const slideWidth = 100 / visibleCount
    const trackTranslate = `translateX(-${currentIndex * slideWidth}%)`

    const productCount = products.length
    const logicalIndex = canCarousel
        ? ((currentIndex - visibleCount) % Math.max(productCount, 1) + Math.max(productCount, 1)) % Math.max(productCount, 1)
        : 0
    const pageCount = productCount > 0 ? Math.ceil(productCount / visibleCount) : 0
    const activePage = pageCount > 0 ? Math.floor(logicalIndex / visibleCount) % pageCount : 0

    return (
        <section className='w-full px-6 md:px-16 py-14'>
            <div className='max-w-5xl mx-auto'>

                {/* ── Section Header ── */}
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                            {subtitle}
                        </p>
                        <h2 className='text-white text-2xl font-bold tracking-tight'>
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onSeeAll}
                        className='flex items-center gap-1 text-zinc-400 hover:text-emerald-400 text-sm transition-colors duration-200 cursor-pointer'
                    >
                        See all <ChevronRight size={15} />
                    </button>
                </div>

                {/* ── Loading Skeleton ── */}
                {loading && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'>
                                <div className='w-full h-44 bg-zinc-800 animate-pulse' />
                                <div className='p-4 flex flex-col gap-2'>
                                    <div className='h-3 bg-zinc-800 rounded-full w-3/4 animate-pulse' />
                                    <div className='h-3 bg-zinc-800 rounded-full w-1/2 animate-pulse' />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Product Carousel ── */}
                {!loading && products.length > 0 && (
                    <div
                        className='relative'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {canCarousel && (
                            <>
                                <button
                                    onClick={movePrev}
                                    aria-label='Previous products'
                                    className='absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center cursor-pointer'
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => moveNext(true)}
                                    aria-label='Next products'
                                    className='absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center cursor-pointer'
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
                                            className='group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 h-full'
                                        >
                                            {/* Image */}
                                            <div className='relative w-full h-44 overflow-hidden bg-zinc-800'>
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                                                    />
                                                ) : (
                                                    <div className='w-full h-full flex items-center justify-center text-zinc-600 text-xs'>
                                                        No Image
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center'>
                                                    <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                                                        <Eye size={16} /> View Details
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className='p-4 flex flex-col gap-1.5 flex-1'>
                                                <h3 className='text-white text-sm font-medium leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-emerald-300'>
                                                    {product.title}
                                                </h3>
                                                <div className='mt-auto pt-2 flex items-center justify-between'>
                                                    <span className='text-emerald-400 font-semibold text-sm transition-all duration-300 group-hover:tracking-wide'>
                                                        {product.price != null ? '\u20B9' + product.price.toLocaleString('en-IN') : 'N/A'}
                                                    </span>
                                                    {product.stock === 0 ? (
                                                        <span className='text-xs text-red-400'>Out of stock</span>
                                                    ) : (
                                                        <span className='text-xs text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300'>
                                                            {product.stock} left
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {canCarousel && pageCount > 1 && (
                            <div className='flex items-center justify-center gap-2 mt-5'>
                                {Array.from({ length: pageCount }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            pauseAfterManualInteraction()
                                            setCurrentIndex(visibleCount + index * visibleCount)
                                        }}
                                        aria-label={`Go to slide ${index + 1}`}
                                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                            activePage === index
                                                ? 'w-6 bg-emerald-400'
                                                : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Empty State ── */}
                {!loading && products.length === 0 && (
                    <div className='flex flex-col items-center justify-center py-16 gap-3'>
                        <ShoppingBag size={32} className='text-zinc-700' />
                        <p className='text-zinc-400 text-sm'>No products available right now.</p>
                    </div>
                )}

            </div>
        </section>
    )
}

export default ProductRail
