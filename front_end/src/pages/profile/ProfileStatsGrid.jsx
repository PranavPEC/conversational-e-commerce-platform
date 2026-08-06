import { ShoppingBag, Heart, MapPin, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// ── 4-card stat strip, same "data-driven map" pattern as PerksBar.jsx ──
// Props:
//   ordersCount — real number, passed down from Profile.jsx (state.order.orders.length)

function ProfileStatsGrid({ ordersCount }) {
    const { t } = useTranslation('profile')

    // Wishlist and Addresses aren't built yet — show '—' instead of '0' so it
    // reads as "not available yet" rather than "you have zero of these,"
    // which would be a misleading claim about a feature that doesn't exist.
    const STATS = [
        {
            icon: ShoppingBag,
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            label: 'orders',
            value: ordersCount,
            desc: 'total_orders',
        },
        {
            icon: Heart,
            iconColor: 'text-pink-400',
            iconBg: 'bg-pink-500/10',
            label: 'wishlist',
            value: '—',
            desc: 'coming_soon',
        },
        {
            icon: MapPin,
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
            label: 'addresses',
            value: '—',
            desc: 'coming_soon',
        },
        {
            icon: ShieldCheck,
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            label: 'account',
            value: t('active'),
            desc: 'account_status',
        },
    ]


    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {STATS.map(({ icon: Icon, iconColor, iconBg, label, value, desc }) => (
                <div
                    key={label}
                    className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4'
                >
                    <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={iconColor} />
                    </div>
                    <div>
                        <p className='text-zinc-500 text-xs'>{t(label)}</p>
                        <p className='text-white text-lg font-semibold leading-tight'>{value}</p>
                        <p className='text-zinc-600 text-xs mt-0.5'>{t(desc)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProfileStatsGrid