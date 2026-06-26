import React from 'react'
import { ShoppingBag, ArrowRight } from 'lucide-react'

// Full-width gradient hero section
// Props:
//   firstName  — first word of user's name for the greeting ("Hey, Pranav 👋")
//   onBrowse   — navigates to /products (Browse Products button)
//   onCart     — navigates to /cart (View Cart button)

function HeroSection({ firstName, onBrowse, onCart }) {
    return (
        <section
            className='relative w-full overflow-hidden flex flex-col justify-center px-6 md:px-16 py-20 md:py-28'
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1f1a 55%, #0a0f0a 100%)' }}
        >
            {/* Decorative blobs — same pattern as Login/SignUp left panels */}
            <div
                className='absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none'
                style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
            />
            <div
                className='absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none'
                style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
            />

            <div className='relative z-10 max-w-2xl'>

                {/* Eyebrow label */}
                <div className='flex items-center gap-2 mb-5'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
                    <span className='text-emerald-400 text-xs font-medium tracking-widest uppercase'>
                        Welcome back
                    </span>
                </div>

                {/* Personalized greeting */}
                <h1 className='text-white text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-3'>
                    Hey, {firstName} 👋
                </h1>
                <h2 className='text-emerald-400 text-3xl md:text-5xl font-bold leading-tight mb-6'>
                    ready to shop?
                </h2>

                {/* Divider line */}
                <div className='w-16 h-1 bg-emerald-500 rounded-full mb-6' />

                <p className='text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mb-10'>
                    Explore thousands of products handpicked just for you. From deals to doorstep — ShopAI has it all.
                </p>

                {/* CTAs */}
                <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                        onClick={onBrowse}
                        className='flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        Browse Products
                        <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={onCart}
                        className='flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border border-zinc-700 hover:border-emerald-500 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        <ShoppingBag size={15} />
                        View Cart
                    </button>
                </div>

            </div>
        </section>
    )
}

export default HeroSection
