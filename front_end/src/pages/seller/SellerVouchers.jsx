import { useTranslation } from 'react-i18next'
import CouponManagement from '../CouponManagement.jsx'
import SellerHeader from './SellerHeader.jsx'

function SellerVouchers() {
    const { t } = useTranslation('coupon')

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8'>
                <SellerHeader title={t('page_title_seller')} />
                <CouponManagement />
            </div>
        </div>
    )
}

export default SellerVouchers
