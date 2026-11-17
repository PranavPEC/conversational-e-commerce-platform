import { useTranslation } from 'react-i18next'
import CouponManagement from '../CouponManagement.jsx'
import AdminHeader from './AdminHeader.jsx'

function AdminCoupons() {
    const { t } = useTranslation('coupon')

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8'>
                <AdminHeader title={t('page_title_admin')} />
                <CouponManagement adminView />
            </div>
        </div>
    )
}

export default AdminCoupons
