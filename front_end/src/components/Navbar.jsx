import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../features/auth/authThunks.js'
import { clearCart } from '../features/cart/cartSlice.js'
import { getInitial } from '../utils/CommonFunctions.js'   // fixed typo: getInital → getInitial

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { cartCount } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    dispatch(clearCart())
    navigate('/login',{replace:true})
  }

  const isActive = (path) => location.pathname === path

  // ── Guest Navbar — shown when not logged in ──
  // Only shows Logo + Login + Signup
  if (!userData) {
    return (
      <nav className='w-full bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50'>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className='text-white font-bold text-lg tracking-tight cursor-pointer'
        >
          Shop<span className='text-emerald-400'>AI</span>
        </div>

        {/* Guest actions */}
        <div className='flex items-center gap-3'>
          <button
            onClick={() => navigate('/login')}
            className='text-sm text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer'
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className='text-sm px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-colors duration-200 cursor-pointer'
          >
            Sign Up
          </button>
        </div>

      </nav>
    )
  }

  // ── Authenticated Navbar — full nav with links, cart badge, admin ──
  return (
    <nav className='w-full bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50'>

      {/* Logo */}
      <div
        onClick={() => navigate('/home')}
        className='text-white font-bold text-lg tracking-tight cursor-pointer'
      >
        Shop<span className='text-emerald-400'>AI</span>
      </div>

      {/* Nav Links */}
      <div className='flex items-center gap-6'>

        <button
          onClick={() => navigate('/home')}
          className={`text-sm transition-colors duration-200 ${
            isActive('/home') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => navigate('/products')}
          className={`text-sm transition-colors duration-200 ${
            isActive('/products') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Products
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`text-sm transition-colors duration-200 ${
            isActive('/orders') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Orders
        </button>

        {/* Cart with badge */}
        <button
          onClick={() => navigate('/cart')}
          className={`relative text-sm transition-colors duration-200 ${
            isActive('/cart') ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Cart
          {cartCount > 0 && (
            <span className='absolute -top-2 -right-4 bg-emerald-500 text-zinc-950 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center'>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        {/* Admin — only visible to admin role */}
        {userData?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className={`text-sm transition-colors duration-200 ${
              isActive('/admin') ? 'text-emerald-400 font-medium' : 'text-emerald-600 hover:text-emerald-400'
            }`}
          >
            Admin
          </button>
        )}

      </div>

      {/* User info + Logout */}
      <div className='flex items-center gap-4'>

        <div className='flex items-center gap-2'>
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt={userData.name}
              className='w-8 h-8 rounded-full object-cover border border-zinc-700'
            />
          ) : (
            <div className='w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold'>
              {getInitial(userData)}
            </div>
          )}
          <span className='text-zinc-300 text-sm hidden md:block'>{userData?.name}</span>
        </div>

        <button
          onClick={handleLogout}
          className='text-sm text-zinc-400 hover:text-red-400 transition-colors duration-200 cursor-pointer'
        >
          Logout
        </button>

      </div>

    </nav>
  )
}

export default Navbar