import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PrimaryButton from './common_components/PrimaryButton.jsx'
import { Heart, ShoppingCart, User, Package, Settings, LogOut, ChevronDown } from 'lucide-react'

// ── New architecture: logoutUser is a plain async function, call directly ──
import { logoutUser } from '../redux/reduxActions'

// ── clearCart is still from features/ — not yet migrated ──
// Will be swapped to ../redux/reduxActions once cartActions.js is migrated
import { clearCart } from '../redux/reduxActions'

import { getInitial } from '../utils/CommonFunctions.js'

function Navbar() {
  const dispatch = useDispatch()    // still needed for clearCart (RTK action)
  const navigate = useNavigate()
  const location = useLocation()

  const { cartCount } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.auth)

  // ── Profile dropdown state ──
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // ── Close dropdown when clicking anywhere outside it ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    // logoutUser is a plain async function — call directly, no dispatch()
    await logoutUser()
    // clearCart is still an RTK action — needs dispatch() until cart is migrated
    dispatch(clearCart())
    setDropdownOpen(false)
    navigate('/login', { replace: true })
  }

  const isActive = (path) => location.pathname === path

  // ── Guest Navbar ──
  if (!userData) {
    return (
      <nav className='w-full bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between sticky top-0 z-50'>
        <div
          onClick={() => navigate('/')}
          className='text-[var(--color-text-primary)] font-bold text-lg tracking-tight cursor-pointer'
        >
          Shop<span className='text-emerald-400'>AI</span>
        </div>
        <div className='flex items-center gap-3'>
          {/* ── Login — outline/secondary style, sized to match the navbar's natural height ── */}
          <button
            onClick={() => navigate('/login')}
            className='flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--color-input-border)] hover:border-emerald-500 hover:-translate-y-1 active:scale-95 text-[var(--color-text-primary)] rounded-xl text-sm transition-all duration-300 cursor-pointer'
          >
            Login
          </button>

          {/* ── Sign Up — reuses PrimaryButton, opted into the compact "sm" size for Navbar ── */}
          <PrimaryButton
            text='Sign Up'
            onClick={() => navigate('/signup')}
            size='sm'
          />
        </div>
      </nav>
    )
  }

  // ── Authenticated Navbar ──
  return (
    <nav className='w-full bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between sticky top-0 z-50'>

      <div
        onClick={() => navigate('/')}
        className='text-[var(--color-text-primary)] font-bold text-lg tracking-tight cursor-pointer flex-shrink-0'
      >
        Shop<span className='text-emerald-400'>AI</span>
      </div>

      <div className='flex items-center gap-6'>
        <button
          onClick={() => navigate('/products')}
          className={`text-sm transition-colors duration-200 ${isActive('/products') ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          Products
        </button>
      </div>

      {/* ── Right cluster: Wishlist, Cart, Profile dropdown ── */}
      <div className='flex items-center gap-5'>

        {/* ── Wishlist — icon only, not functional yet ── */}
        <button
          onClick={() => { }}
          aria-label='Wishlist'
          className='text-[var(--color-text-secondary)] hover:text-emerald-400 transition-colors duration-200 cursor-pointer'
        >
          <Heart size={20} />
        </button>

        {/* ── Cart — icon only, stays outside the dropdown ── */}
        <button
          onClick={() => navigate('/cart')}
          aria-label='Cart'
          className={`relative transition-colors duration-200 cursor-pointer ${isActive('/cart') ? 'text-emerald-400' : 'text-[var(--color-text-secondary)] hover:text-emerald-400'}`}
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-emerald-500 text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        {/* ── Profile dropdown ── */}
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className='flex items-center gap-1.5 cursor-pointer'
          >
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt={userData.name}
                className='w-9 h-9 rounded-full object-cover border border-[var(--color-input-border)]'
              />
            ) : (
              <div className='w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm font-semibold'>
                {getInitial(userData)}
              </div>
            )}
            <ChevronDown
              size={16}
              className={`text-[var(--color-text-secondary)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className='absolute right-0 mt-3 w-52 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl shadow-black/20 py-2 z-50'>

              <button
                onClick={() => { setDropdownOpen(false); navigate('/profile') }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
              >
                <User size={16} /> Profile
              </button>

              <button
                onClick={() => { setDropdownOpen(false); navigate('/orders') }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
              >
                <Package size={16} /> My Orders
              </button>

              {userData?.role === 'admin' && (
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/admin') }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
                >
                  <Package size={16} /> Admin
                </button>
              )}

              <button
                onClick={() => { setDropdownOpen(false); navigate('/settings') }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
              >
                <Settings size={16} /> Settings
              </button>

              <div className='my-1.5 border-t border-[var(--color-border)]' />

              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[var(--color-input-bg)] hover:text-red-300 transition-colors duration-200 cursor-pointer'
              >
                <LogOut size={16} /> Logout
              </button>

            </div>
          )}
        </div>

      </div>

    </nav>
  )
}

export default Navbar
