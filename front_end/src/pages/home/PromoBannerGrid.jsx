import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useScrollReveal from '../../hooks/useScrollReveal'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

const PROMO_CARDS = [
    {
        title: 'New Season Arrivals',
        subtitle: 'Fresh placeholder picks for this month',
        darkGradient: 'bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950',
        lightGradient: 'bg-gradient-to-br from-emerald-100 via-white to-zinc-100',
    },
    {
        title: 'Under ₹999 Store',
        subtitle: 'Placeholder deals for budget-friendly finds',
        darkGradient: 'bg-gradient-to-br from-cyan-500/15 via-zinc-900 to-zinc-950',
        lightGradient: 'bg-gradient-to-br from-cyan-100 via-white to-zinc-100',
    },
]

function PromoBannerGrid() {
    const navigate = useNavigate()
    const { theme } = useSelector(state => state.theme)
    const [ref, isVisible] = useScrollReveal()

    const isLight = theme === 'light'

    return (
        <section
            ref={ref}
            className={`w-full px-6 md:px-16 py-6 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5'>
                {PROMO_CARDS.map(card => (
                    <button
                        key={card.title}
                        onClick={() => navigate(navigationStrings.PRODUCTS)}
                        className={`rounded-2xl overflow-hidden relative h-48 p-6 text-left border cursor-pointer transition-colors duration-200 ${
                            isLight
                                ? `border-zinc-200 hover:border-emerald-500 ${card.lightGradient}`
                                : `border-zinc-800 hover:border-emerald-500 ${card.darkGradient}`
                        }`}
                    >
                        <div className='h-full flex flex-col justify-between'>
                            <div>
                                <h3 className={`text-2xl font-bold leading-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                                    {card.title}
                                </h3>
                                <p className={`text-sm mt-2 ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                                    {card.subtitle}
                                </p>
                            </div>

                            <span className={`text-sm font-medium ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                Shop Now →
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}

export default PromoBannerGrid
