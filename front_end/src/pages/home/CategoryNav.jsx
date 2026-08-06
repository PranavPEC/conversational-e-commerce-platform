import { useNavigate } from 'react-router-dom'
import { Smartphone, Shirt, Home, Sparkles, Watch, Headphones, Laptop, Gem } from 'lucide-react'
import {useTranslation} from 'react-i18next'
import useScrollReveal from '../../hooks/useScrollReveal'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

const CATEGORIES = [
    { key: 'electronics', label: 'category_electronics', icon: Smartphone },
    { key: 'fashion', label: 'category_fashion', icon: Shirt },
    { key: 'home', label: 'category_home', icon: Home },
    { key: 'beauty', label: 'category_beauty', icon: Sparkles },
    { key: 'accessories', label: 'category_accessories', icon: Watch },
    { key: 'audio', label: 'category_audio', icon: Headphones },
    { key: 'laptops', label: 'category_laptops', icon: Laptop },
    { key: 'premium', label: 'category_premium', icon: Gem },
]

function CategoryNav() {
    const navigate = useNavigate()
    const [ref, isVisible] = useScrollReveal()
    const { t } = useTranslation('home')
    return (
        <section
            ref={ref}
            className={`w-full px-6 md:px-16 py-8 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <div className='max-w-5xl mx-auto flex flex-col items-center gap-5'>
                <div className='text-center'>
                    <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                        {t('explore')}
                    </p>
                    <h2 className='text-white text-xl md:text-2xl font-bold tracking-tight'>
                        {t('shop_by_category')}
                    </h2>
                </div>

                <div
                    className='w-full overflow-x-auto [&::-webkit-scrollbar]:hidden'
                    style={{ scrollbarWidth: 'none' }}
                >
                    <div className='w-max min-w-full flex justify-center items-start gap-4'>
                        {CATEGORIES.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => navigate(navigationStrings.PRODUCTS + '?category=' + encodeURIComponent(key))}
                                className='group min-w-[76px] flex flex-col items-center gap-2 cursor-pointer'
                            >
                                <div className='w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors duration-200 group-hover:border-emerald-500'>
                                    <Icon size={22} className='text-zinc-400 transition-colors duration-200 group-hover:text-emerald-400' />
                                </div>
                                <span className='text-xs text-zinc-400 whitespace-nowrap'>{t(label)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategoryNav
