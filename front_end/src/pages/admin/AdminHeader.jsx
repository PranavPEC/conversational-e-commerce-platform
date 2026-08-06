import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

// Props:
//   onAddClick — called when "Add Product" button is clicked
//                resets form to create mode and shows the form panel

function AdminHeader({ onAddClick }) {
    const { t } = useTranslation('admin')
    return (
        <div className='flex items-center justify-between'>
            <div>
                <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                    {t('admin')}
                </p>
                <h1 className='text-white text-2xl font-bold tracking-tight'>
                    {t('product_dashboard')}
                </h1>
            </div>
            <button
                onClick={onAddClick}
                className='flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
                <Plus size={16} />
                {t('add_product')}
            </button>
        </div>
    )
}

export default AdminHeader
