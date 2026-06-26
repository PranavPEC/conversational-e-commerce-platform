import React from 'react'
import { Tag, Truck, Shield, Package } from 'lucide-react'

// Static perks bar — no props, no logic, no Redux
// Data lives here because it never changes and has no external dependency
// If perks ever need to be dynamic (from backend), add a props: perks array

const PERKS = [
    { icon: Tag,     title: 'Exclusive deals',  desc: 'Members-only offers every week' },
    { icon: Truck,   title: 'Free delivery',     desc: 'On all orders, no minimum' },
    { icon: Shield,  title: 'Secure checkout',   desc: '100% safe & encrypted' },
    { icon: Package, title: 'Easy returns',      desc: '7-day hassle-free return policy' },
]

function PerksBar() {
    return (
        <section className='w-full bg-zinc-900 border-y border-zinc-800 px-6 md:px-16 py-8'>
            <div className='max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6'>
                {PERKS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className='flex items-start gap-3'>
                        <div className='w-9 h-9 rounded-full border border-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                            <Icon size={15} className='text-emerald-400' />
                        </div>
                        <div>
                            <p className='text-white text-sm font-medium'>{title}</p>
                            <p className='text-zinc-500 text-xs mt-0.5'>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PerksBar
