import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from 'recharts'
import { Users, Store, Package, ClipboardList, IndianRupee, Hourglass } from 'lucide-react'
import { fetchDashboardStats } from '../../redux/reduxActions'
import { formatCurrency } from '../../utils/CommonFunctions.js'
import AdminHeader from './AdminHeader.jsx'
import { StatCard, ChartCard, RankedList } from '../../components/dashboard/DashboardWidgets.jsx'

const CATEGORY_COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#f43f5e', '#a3e635', '#f97316', '#8b5cf6']

const DashboardLoading = () => (
    <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-24 animate-pulse' />
            ))}
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl h-80 animate-pulse' />
            ))}
        </div>
    </div>
)

function Admin() {
    const { t, i18n } = useTranslation('admin')
    const isRTL = i18n.dir() === 'rtl'
    const { dashboardStats, dashboardLoading, dashboardError } = useSelector(state => state.admin)

    useEffect(() => {
        fetchDashboardStats().catch(() => {
            // Intentionally ignored here — dashboardError is already surfaced below.
        })
    }, [])

    const renderContent = () => {
        if (dashboardLoading) return <DashboardLoading />

        if (dashboardError) {
            return (
                <div className='flex flex-col items-center justify-center gap-3 py-16'>
                    <p className='text-red-400 text-sm'>{dashboardError}</p>
                    <button
                        onClick={() => fetchDashboardStats()}
                        className='px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t('retry')}
                    </button>
                </div>
            )
        }

        if (!dashboardStats) return null

        const {
            summary,
            ordersByStatus = [],
            revenueOverTime = [],
            topSellers = [],
            topProducts = [],
            productsByCategory = [],
        } = dashboardStats

        return (
            <div className='flex flex-col gap-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    <StatCard icon={Users} label={t('total_users')} value={summary.totalUsers} />
                    <StatCard icon={Store} label={t('total_sellers')} value={summary.totalSellers} />
                    <StatCard icon={Package} label={t('total_products')} value={summary.totalProducts} />
                    <StatCard icon={ClipboardList} label={t('total_orders')} value={summary.totalOrders} />
                    <StatCard icon={IndianRupee} label={t('total_revenue')} value={formatCurrency(summary.totalRevenue, isRTL)} />
                    <StatCard icon={Hourglass} label={t('pending_approvals')} value={summary.pendingApprovals} />
                </div>

                <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                    <ChartCard title={t('orders_by_status')}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={ordersByStatus}>
                                <CartesianGrid strokeDasharray='3 3' stroke='#27272a' />
                                <XAxis dataKey='status' stroke='#a1a1aa' fontSize={12} />
                                <YAxis stroke='#a1a1aa' fontSize={12} allowDecimals={false} />
                                <Tooltip cursor={{ fill: '#18181b' }} contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12, color: '#fff' }} />
                                <Bar dataKey='count' fill='#10b981' radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title={t('revenue_over_time')}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart data={revenueOverTime}>
                                <CartesianGrid strokeDasharray='3 3' stroke='#27272a' />
                                <XAxis dataKey='month' stroke='#a1a1aa' fontSize={12} />
                                <YAxis stroke='#a1a1aa' fontSize={12} width={70} />
                                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12, color: '#fff' }} />
                                <Line type='monotone' dataKey='revenue' stroke='#10b981' strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title={t('products_by_category')}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <PieChart>
                                <Pie data={productsByCategory} dataKey='count' nameKey='category' outerRadius={90} label>
                                    {productsByCategory.map((entry, index) => (
                                        <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12, color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <div className='grid grid-cols-1 gap-6'>
                        <RankedList
                            title={t('top_sellers')}
                            items={topSellers}
                            renderName={(seller) => seller.name}
                            renderMeta={(seller) => formatCurrency(seller.revenue, isRTL)}
                            emptyLabel={t('no_sellers_data')}
                        />
                        <RankedList
                            title={t('top_products')}
                            items={topProducts}
                            renderName={(product) => product.title}
                            renderMeta={(product) => `${product.unitsSold} ${t('units_sold')}`}
                            emptyLabel={t('no_products_data')}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-7xl mx-auto flex flex-col gap-8'>
                <AdminHeader />
                {renderContent()}
            </div>
        </div>
    )
}

export default Admin
