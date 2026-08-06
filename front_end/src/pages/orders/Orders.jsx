import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { fetchUserOrders, cancelOrder } from '../../redux/reduxActions'
import { useTranslation } from 'react-i18next'
import AccountSidebar from '../../components/common_components/AccountSidebar'
import OrdersLoading from './OrdersLoading.jsx'
import OrdersEmpty from './OrdersEmpty.jsx'
import OrdersError from './OrdersError.jsx'
import OrdersHeader from './OrdersHeader.jsx'
import OrderCard from './OrderCard.jsx'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function Orders() {
    const { t } = useTranslation('orders')
    const navigate = useNavigate()
    const getProductDetailRoute = (id) => navigationStrings.PRODUCT_DETAIL.replace(':id', id)
    const { orders, ordersLoading, ordersError } = useSelector(state => state.order)

    useEffect(() => {
        fetchUserOrders().catch(() => {
            // Intentionally ignored here — ordersError is already surfaced in OrdersError.
        })
    }, [])

    const handleCancelOrder = async (id) => {
        try {
            await cancelOrder(id)
        } catch {
            // Intentionally ignored here — ordersError is already surfaced in OrdersError.
        }
    }

    // ── Decide which content to show — sidebar + wrapper stay constant ──
    // regardless of state, so AccountSidebar never flickers in/out.
    const renderContent = () => {
        if (ordersLoading) return <OrdersLoading />
        if (!ordersLoading && orders.length === 0) return <OrdersEmpty onBrowse={() => navigate(navigationStrings.PRODUCTS)} />
        if (ordersError) return <OrdersError error={ordersError} onRetry={() => fetchUserOrders()} />

        return (
            <>
                <OrdersHeader count={orders.length} />

                <div className='flex flex-col gap-4'>
                    {orders.map(order => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            onProductClick={(id) => navigate(getProductDetailRoute(id))}
                            onCancel={handleCancelOrder}
                        />
                    ))}
                </div>

                <div className='mt-8 flex justify-center'>
                    <button
                        onClick={() => navigate(navigationStrings.PRODUCTS)}
                        className='flex items-center gap-2 text-zinc-400 hover:text-emerald-400 text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t('continue_shopping')}
                        <ChevronRight size={15} />
                    </button>
                </div>
            </>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            {/* max-w-6xl matches Profile.jsx exactly — keeps AccountSidebar
                aligned at the same horizontal position across both pages */}
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-8'>

                <AccountSidebar />

                <div className='flex-1 min-w-0'>
                    {renderContent()}
                </div>

            </div>
        </div>
    )
}

export default Orders