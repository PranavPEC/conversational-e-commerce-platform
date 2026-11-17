import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSellerOrders, updateSellerOrderStatus } from '../../redux/reduxActions'
import { useTranslation } from 'react-i18next'
import SellerHeader from './SellerHeader.jsx'
import OrderCard from '../orders/OrderCard.jsx'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function SellerOrders() {
    const { t } = useTranslation('seller')
    const navigate = useNavigate()
    const getProductDetailRoute = (id) => navigationStrings.PRODUCT_DETAIL.replace(':id', id)
    const { sellerOrders, sellerOrdersLoading, sellerOrdersError } = useSelector(state => state.order)

    useEffect(() => {
        fetchSellerOrders().catch(() => {
            // Intentionally ignored here — sellerOrdersError is already surfaced below.
        })
    }, [])

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateSellerOrderStatus(orderId, status)
        } catch {
            // Intentionally ignored here — sellerOrdersError is already surfaced below.
        }
    }

    const renderContent = () => {
        if (sellerOrdersLoading) {
            return (
                <div className='flex flex-col gap-4'>
                    {[1, 2, 3].map(i => (
                        <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-24 animate-pulse' />
                    ))}
                </div>
            )
        }

        if (sellerOrdersError) {
            return (
                <div className='flex flex-col items-center justify-center gap-3 py-16'>
                    <p className='text-red-400 text-sm'>{sellerOrdersError}</p>
                    <button
                        onClick={() => fetchSellerOrders()}
                        className='px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t('retry')}
                    </button>
                </div>
            )
        }

        if (sellerOrders.length === 0) {
            return (
                <div className='flex flex-col items-center justify-center gap-2 py-16'>
                    <p className='text-zinc-400 text-sm'>{t('no_orders_yet')}</p>
                </div>
            )
        }

        return (
            <div className='flex flex-col gap-4'>
                {sellerOrders.map(order => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onProductClick={(id) => navigate(getProductDetailRoute(id))}
                        isSellerView
                        onApprove={(id) => handleStatusChange(id, 'placed')}
                        onReject={(id) => handleStatusChange(id, 'rejected')}
                        onShip={(id) => handleStatusChange(id, 'shipped')}
                        onDeliver={(id) => handleStatusChange(id, 'delivered')}
                        onApproveReturn={(id) => updateSellerOrderStatus(id, 'return_approved').catch(() => {})}
                        onRejectReturn={(id) => updateSellerOrderStatus(id, 'return_rejected').catch(() => {})}
                        onRefund={(id) => updateSellerOrderStatus(id, 'refunded').catch(() => {})}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8'>

                <SellerHeader title={t('orders_dashboard')} />

                {renderContent()}

            </div>
        </div>
    )
}

export default SellerOrders
