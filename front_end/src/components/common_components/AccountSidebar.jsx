import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { User, Package, Heart, Settings, LogOut } from 'lucide-react'

import { logoutUser } from '../../redux/reduxActions'
import { clearCart } from '../../redux/reduxActions'   // still an RTK action — needs dispatch()

// ── Reusable account nav ──
// Used by Profile now. Settings and Wishlist pages will reuse this same
// component once they're built, instead of copy-pasting this nav list a
// second and third time — same 5 items already live in the Navbar dropdown,
// this is just the same list rendered as a sidebar instead of a menu.
//
// `path: null` marks tabs that don't have a route yet (Wishlist, Settings).
// Clicking them does nothing for now — same placeholder treatment as the
// Wishlist heart icon in Navbar.jsx.
const NAV_ITEMS = [
    { key: 'profile',  label: 'Profile',    icon: User,     path: '/profile' },
    { key: 'orders',   label: 'My Orders',  icon: Package,  path: '/orders' },
    { key: 'wishlist', label: 'Wishlist',   icon: Heart,    path: null },
    { key: 'settings', label: 'Settings',   icon: Settings, path: '/settings' },
]

function AccountSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    // ── Same logout logic as Navbar.jsx ──
    // Duplicated here rather than imported from Navbar, because Navbar's
    // handleLogout also closes its dropdown (setDropdownOpen(false)), which
    // has no meaning in a sidebar. If this starts drifting out of sync with
    // Navbar's version, that's the signal to extract a shared useLogout()
    // hook — same "wait for the 2nd/3rd repeat" rule as any other component.
    const handleLogout = async () => {
        await logoutUser()
        dispatch(clearCart())
        navigate('/login', { replace: true })
    }

    return (
        <aside className='w-full md:w-56 flex-shrink-0'>
            <nav className='flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0'>

                {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => {
                    const isActive = path !== null && location.pathname === path

                    return (
                        <button
                            key={key}
                            onClick={() => path && navigate(path)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                            <Icon size={17} />
                            {label}
                        </button>
                    )
                })}

                <div className='hidden md:block my-2 border-t border-[var(--color-border)]' />

                <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-[var(--color-input-bg)] hover:text-red-300 transition-colors duration-200 cursor-pointer whitespace-nowrap'
                >
                    <LogOut size={17} />
                    Logout
                </button>

            </nav>
        </aside>
    )
}

export default AccountSidebar