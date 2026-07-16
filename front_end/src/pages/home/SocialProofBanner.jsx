import { useEffect, useState } from 'react'
import { Star, ArrowRight } from 'lucide-react'
import PrimaryButton from '../../components/common_components/PrimaryButton'
import useScrollReveal from '../../hooks/useScrollReveal'

// Placeholder testimonials — fictional names, not real customer data yet.
// Replace with real reviews once a testimonial/review backend feature is built.
const TESTIMONIALS = [
    {
        name: 'Alex M.',
        quote: '"ShopAI helped me find exactly what I was looking for in seconds. The recommendations were spot on!"',
        rating: 5,
    },
    {
        name: 'Priya S.',
        quote: '"Fast delivery, great quality. I love how easy it is to browse and checkout. Will definitely be back."',
        rating: 5,
    },
    {
        name: 'Jordan K.',
        quote: '"The deals on this platform are genuinely unbeatable. Found my headphones at half the usual price."',
        rating: 4,
    },
    {
        name: 'Sneha R.',
        quote: '"Super clean interface and a smooth shopping experience. Customer support was helpful too!"',
        rating: 5,
    },
]

// Props:
//   onShopNow — navigates to /products
function SocialProofBanner({ onShopNow }) {
    const [ref, isVisible] = useScrollReveal()
    const [activeIndex, setActiveIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    // Auto-advance carousel every 4.5 seconds with fade transition
    useEffect(() => {
        const timer = setInterval(() => {
            // Fade out → swap → fade in
            setVisible(false)
            setTimeout(() => {
                setActiveIndex(prev => (prev + 1) % TESTIMONIALS.length)
                setVisible(true)
            }, 500)
        }, 4500)

        return () => clearInterval(timer)
    }, [])

    const goTo = (index) => {
        if (index === activeIndex) return
        setVisible(false)
        setTimeout(() => {
            setActiveIndex(index)
            setVisible(true)
        }, 300)
    }

    const current = TESTIMONIALS[activeIndex]

    return (
        <section
            ref={ref}
            className={`w-full px-6 md:px-16 pb-16 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <div className='max-w-5xl mx-auto flex flex-col gap-5'>

                {/* ── Testimonial carousel ── */}
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center gap-4'>

                    {/* Stars */}
                    <div className='flex items-center gap-0.5'>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                size={14}
                                className={i <= current.rating
                                    ? 'text-emerald-400 fill-emerald-400'
                                    : 'text-zinc-700 fill-zinc-700'}
                            />
                        ))}
                    </div>

                    {/* Quote — fade between testimonials */}
                    <div
                        className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <p className='text-zinc-300 text-sm md:text-base leading-relaxed max-w-xl'>
                            {current.quote}
                        </p>
                        <p className='text-emerald-400 text-xs font-semibold mt-3'>
                            — {current.name}
                        </p>
                    </div>

                    {/* Dot indicators */}
                    <div className='flex items-center gap-2 mt-1'>
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 cursor-pointer ${
                                    i === activeIndex ? 'bg-emerald-400' : 'bg-zinc-700 hover:bg-zinc-500'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Avatar stack + rating + CTA — unchanged ── */}
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6'>

                    <div className='flex items-center gap-4'>
                        <div className='flex -space-x-2'>
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className='w-9 h-9 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs text-white font-medium'
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className='w-9 h-9 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-950 font-bold'>
                                +2K
                            </div>
                        </div>
                        <div>
                            <p className='text-white text-sm font-medium'>2,000+ happy customers</p>
                            <div className='flex items-center gap-0.5 mt-1'>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={12} className='text-emerald-400 fill-emerald-400' />
                                ))}
                                <span className='text-zinc-500 text-xs ml-1.5'>5.0 average rating</span>
                            </div>
                        </div>
                    </div>

                    <PrimaryButton
                        text="Shop Now"
                        icon={<ArrowRight size={15} />}
                        onClick={onShopNow}
                    />

                </div>

            </div>
        </section>
    )
}

export default SocialProofBanner
