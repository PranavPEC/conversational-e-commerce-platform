import React from 'react'
import { Star, ArrowRight } from 'lucide-react'

// Static social proof banner at the bottom of Home
// Props:
//   onShopNow — navigates to /products

function SocialProofBanner({ onShopNow }) {
    return (
        <section className='w-full px-6 md:px-16 pb-16'>
            <div className='max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6'>

                {/* Avatar stack + rating */}
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

                {/* CTA */}
                <button
                    onClick={onShopNow}
                    className='flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap'
                >
                    Shop Now
                    <ArrowRight size={15} />
                </button>

            </div>
        </section>
    )
}

export default SocialProofBanner
