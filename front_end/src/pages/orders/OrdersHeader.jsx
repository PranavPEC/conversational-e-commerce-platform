import { useTranslation } from 'react-i18next'
// Props:
//   count — total number of orders (orders.length from Orders.jsx)

function OrdersHeader({ count }) {
    const { t } = useTranslation('orders')
    return (
        <div className='mb-8'>
            <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                {t('your_purchases')}
            </p>
            <h1 className='text-white text-2xl font-bold tracking-tight'>
                {t('order_history')}
                <span className='text-zinc-500 text-base font-normal ml-2'>
                    ({count} {count === 1 ? t('order_singular') : t('order_plural')})
                </span>
            </h1>
        </div>
    )
}

export default OrdersHeader