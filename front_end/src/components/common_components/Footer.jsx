import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Camera, Send, Users } from 'lucide-react'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function Footer() {
    const navigate = useNavigate()
    const { t } = useTranslation('common')

    return (
        <footer className='w-full bg-zinc-950 border-t border-zinc-800 px-6 md:px-16 pt-12 pb-6'>
            <div className='max-w-6xl mx-auto'>

                {/* ── Top grid ── */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>

                    {/* ── Brand ── */}
                    <div>
                        <button
                            onClick={() => navigate(navigationStrings.HOME)}
                            className='flex items-center gap-2 cursor-pointer'
                        >
                            <div className='w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center'>
                                <ShoppingBag size={18} className='text-zinc-950' />
                            </div>
                            <span className='text-white font-semibold text-lg tracking-tight'>ShopAI</span>
                        </button>

                        <p className='text-zinc-400 text-sm mt-3 max-w-xs'>
                            {t('footer_tagline')}
                        </p>

                        {/* Lucide doesn't expose brand logos in this version,
                            so these are close placeholder social icons. */}
                        <div className='flex items-center gap-3 mt-4'>
                            <a href='#' className='w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors duration-200'>
                                <Camera size={16} />
                            </a>
                            <a href='#' className='w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors duration-200'>
                                <Send size={16} />
                            </a>
                            <a href='#' className='w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors duration-200'>
                                <Users size={16} />
                            </a>
                        </div>
                    </div>

                    {/* ── Shop ── */}
                    <div>
                        <h3 className='text-white text-sm font-semibold mb-4'>{t('footer_shop_heading')}</h3>
                        <div className='flex flex-col gap-2.5'>
                            <button onClick={() => navigate(navigationStrings.PRODUCTS)} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_products')}</button>
                            <button onClick={() => navigate(navigationStrings.CART)} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_cart')}</button>
                            <button onClick={() => navigate(navigationStrings.ORDERS)} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_orders')}</button>
                        </div>
                    </div>

                    {/* ── Company ── */}
                    <div>
                        <h3 className='text-white text-sm font-semibold mb-4'>{t('footer_company_heading')}</h3>
                        <div className='flex flex-col gap-2.5'>
                            <button onClick={() => { }} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_about')}</button>
                            <button onClick={() => { }} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_careers')}</button>
                            <button onClick={() => { }} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_contact')}</button>
                        </div>
                    </div>

                    {/* ── Help ── */}
                    <div>
                        <h3 className='text-white text-sm font-semibold mb-4'>{t('footer_help_heading')}</h3>
                        <div className='flex flex-col gap-2.5'>
                            <button onClick={() => { }} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_faqs')}</button>
                            <button onClick={() => { }} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_returns_policy')}</button>
                            <button onClick={() => { }} className='text-zinc-400 hover:text-emerald-400 text-sm text-left transition-colors duration-200 cursor-pointer'>{t('footer_shipping_info')}</button>
                        </div>
                    </div>

                </div>

                {/* ── Bottom row ── */}
                <div className='mt-10 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                    <p className='text-zinc-500 text-xs'>{t('footer_copyright', { year: new Date().getFullYear() })}</p>

                    <div className='flex items-center gap-2'>
                        <span className='px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-300 border border-zinc-700 rounded-md'>VISA</span>
                        <span className='px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-300 border border-zinc-700 rounded-md'>MASTERCARD</span>
                        <span className='px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-300 border border-zinc-700 rounded-md'>UPI</span>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer