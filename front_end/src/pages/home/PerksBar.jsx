import { Tag, Truck, Shield, Package } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useTranslation } from 'react-i18next'
// Static perks bar — no props, no logic, no Redux
// Data lives here because it never changes and has no external dependency
// If perks ever need to be dynamic (from backend), add a props: perks array

const PERKS = [
    {
        icon: Tag,
        title: 'exclusive_deals',
        desc: 'exclusive_deals_desc'
    },
    {
        icon: Truck,
        title: 'free_delivery',
        desc: 'free_delivery_desc'
    },
    {
        icon: Shield,
        title: 'secure_checkout',
        desc: 'secure_checkout_desc'
    },
    {
        icon: Package,
        title: 'easy_returns',
        desc: 'easy_returns_desc'
    },
]


function PerksBar() {
    // ── Scroll Reveal ──
    const [ref, isVisible] = useScrollReveal()
    const { t } = useTranslation('home')
    return (
        <section
            ref={ref}
            className={`w-full bg-zinc-900 border-y border-zinc-800 px-6 md:px-16 py-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
        >
            <div className='max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6'>
                {PERKS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className='flex items-start gap-3'>
                        <div className='w-9 h-9 rounded-full border border-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                            <Icon size={15} className='text-emerald-400' />
                        </div>
                        <div>
                            <p className='text-white text-sm font-medium'>{t(title)}</p>
                            <p className='text-zinc-500 text-xs mt-0.5'>{t(desc)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PerksBar