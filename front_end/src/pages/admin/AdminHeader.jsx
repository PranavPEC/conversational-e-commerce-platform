import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function AdminHeader({ title }) {
    const { t } = useTranslation('admin')
    const navigate = useNavigate()
    const location = useLocation()

    const tabClassName = (path) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
        location.pathname === path
            ? 'bg-emerald-500 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
    }`

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                        {t('admin')}
                    </p>
                    <h1 className='text-white text-2xl font-bold tracking-tight'>
                        {title || t('dashboard_title')}
                    </h1>
                </div>
            </div>

            <div className='border-t border-zinc-800 pt-4 mt-4'>
                <div className='inline-flex items-center bg-zinc-900 rounded-xl p-1'>
                    <button
                        onClick={() => navigate(navigationStrings.ADMIN)}
                        className={tabClassName(navigationStrings.ADMIN)}
                    >
                        {t('analytics')}
                    </button>
                    <button
                        onClick={() => navigate(navigationStrings.SELLER_APPLICATIONS)}
                        className={tabClassName(navigationStrings.SELLER_APPLICATIONS)}
                    >
                        {t('seller_applications')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader
