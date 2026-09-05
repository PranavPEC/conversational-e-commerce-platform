import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

// Props:
//   onAddClick — called when "Add Product" button is clicked
//                resets form to create mode and shows the form panel
//                (optional — omitted on pages with no create action, e.g. SellerOrders)
//   title      — optional heading override; defaults to the product dashboard title

function SellerHeader({ onAddClick, title }) {
    const { t } = useTranslation('seller')
    const navigate = useNavigate()
    const location = useLocation()

    const tabClassName = (path) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
        location.pathname === path
            ? 'bg-emerald-500 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
    }`

    return (
        <div className='flex flex-col'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                        {t('seller')}
                    </p>
                    <h1 className='text-white text-2xl font-bold tracking-tight'>
                        {title || t('product_dashboard')}
                    </h1>
                </div>
                {onAddClick && (
                    <button
                        onClick={onAddClick}
                        className='flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-950/30 transition-colors duration-200 cursor-pointer flex-shrink-0'
                    >
                        <Plus size={16} />
                        {t('add_product')}
                    </button>
                )}
            </div>

            <div className='border-t border-zinc-800 pt-4 mt-4'>
                <div className='inline-flex items-center bg-zinc-900 rounded-xl p-1'>
                    <button
                        onClick={() => navigate(navigationStrings.SELLER)}
                        className={tabClassName(navigationStrings.SELLER)}
                    >
                        {t('products_nav')}
                    </button>
                    <button
                        onClick={() => navigate(navigationStrings.SELLER_ORDERS)}
                        className={tabClassName(navigationStrings.SELLER_ORDERS)}
                    >
                        {t('orders_nav')}
                    </button>
                    <button
                        onClick={() => navigate(navigationStrings.SELLER_ANALYTICS)}
                        className={tabClassName(navigationStrings.SELLER_ANALYTICS)}
                    >
                        {t('analytics_nav')}
                    </button>
                </div>
            </div>
        </div>
    )
}


export default SellerHeader
