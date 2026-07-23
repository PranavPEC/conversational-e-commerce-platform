import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import PrimaryButton from './common_components/PrimaryButton.jsx'
import { Heart, ShoppingCart, User, Package, Settings, LogOut, ChevronDown, Search, Menu } from 'lucide-react'

// ── New architecture: logoutUser is a plain async function, call directly ──
import { logoutUser } from '../redux/reduxActions'

// ── clearCart is still from features/ — not yet migrated ──
// Will be swapped to ../redux/reduxActions once cartActions.js is migrated
import { clearCart } from '../redux/reduxActions'
import { GET_ALL_PRODUCTS_URL } from '../config/urls'
import useDebounce from '../hooks/useDebounce'
import navigationStrings from '../constants/navigationStrings/navigationStrings.js'

import { getInitial } from '../utils/CommonFunctions.js'

const NAV_CATEGORIES = [
  { key: 'electronics', label: 'Electronics' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'home', label: 'Home' },
  { key: 'beauty', label: 'Beauty' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'audio', label: 'Audio' },
  { key: 'laptops', label: 'Laptops' },
  { key: 'premium', label: 'Premium' },
]

function Navbar() {
  const dispatch = useDispatch()    // still needed for clearCart (RTK action)
  const navigate = useNavigate()
  const location = useLocation()

  const { cartCount } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.auth)

  // ── Profile dropdown state ──
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const desktopSearchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // ── Search state ──
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput.trim(), 300)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // ── Close dropdowns when clicking anywhere outside ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }

      const isInsideDesktopSearch = desktopSearchRef.current?.contains(e.target)
      const isInsideMobileSearch = mobileSearchRef.current?.contains(e.target)
      if (!isInsideDesktopSearch && !isInsideMobileSearch) {
        setSuggestionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Fetch search suggestions (max 5) ──
  useEffect(() => {
    if (!debouncedSearch) {
      setSearchSuggestions([])
      setSuggestionsOpen(false)
      setSuggestionsLoading(false)
      return
    }

    let isActive = true

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true)

      try {
        const { data } = await axios.get(GET_ALL_PRODUCTS_URL(null, debouncedSearch))
        if (!isActive) return

        const suggestions = (data.data.products || []).slice(0, 5)
        setSearchSuggestions(suggestions)
        setSuggestionsOpen(true)
      } catch {
        if (!isActive) return
        setSearchSuggestions([])
        setSuggestionsOpen(false)
      } finally {
        if (isActive) setSuggestionsLoading(false)
      }
    }

    fetchSuggestions()

    return () => {
      isActive = false
    }
  }, [debouncedSearch])

  const handleLogout = async () => {
    // logoutUser is a plain async function — call directly, no dispatch()
    await logoutUser()
    // clearCart is still an RTK action — needs dispatch() until cart is migrated
    dispatch(clearCart())
    setDropdownOpen(false)
    navigate(navigationStrings.LOGIN, { replace: true })
  }

  const isActive = (path) => location.pathname === path
  const activeCategory = new URLSearchParams(location.search).get('category')?.toLowerCase() || null

  const handleSearchSubmit = () => {
    const query = searchInput.trim()
    setSuggestionsOpen(false)
    setMobileSearchOpen(false)

    if (!query) {
      navigate(navigationStrings.PRODUCTS)
      return
    }

    navigate(navigationStrings.PRODUCTS + '?search=' + encodeURIComponent(query))
  }

  const handleSuggestionClick = (id) => {
    setSuggestionsOpen(false)
    setMobileSearchOpen(false)
    navigate(getProductDetailRoute(id))
  }

  const handleCategoryNav = (category = null) => {
    if (!category) {
      navigate(navigationStrings.PRODUCTS)
      return
    }
    navigate(navigationStrings.PRODUCTS + '?category=' + encodeURIComponent(category))
  }

  const renderSearchBar = (searchRef, mobile = false) => (
    <div ref={searchRef} className='relative w-full'>
      <div className='flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus-within:border-emerald-500 transition-colors duration-200'>
        <Search size={16} className='text-[var(--color-text-secondary)] flex-shrink-0' />
        <input
          type='text'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => {
            if (searchInput.trim()) setSuggestionsOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearchSubmit()
            }
          }}
          placeholder='Search products...'
          className='w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none'
        />
        <button
          onClick={handleSearchSubmit}
          aria-label='Search products'
          className='text-[var(--color-text-secondary)] hover:text-emerald-400 transition-colors duration-200 cursor-pointer'
        >
          <Search size={16} />
        </button>
      </div>

      {suggestionsOpen && (
        <div className='absolute left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl shadow-black/20 py-2 z-50 max-h-80 overflow-y-auto'>
          {suggestionsLoading && (
            <p className='px-4 py-2.5 text-sm text-[var(--color-text-secondary)]'>Searching...</p>
          )}

          {!suggestionsLoading && searchSuggestions.length === 0 && (
            <p className='px-4 py-2.5 text-sm text-[var(--color-text-secondary)]'>No products found.</p>
          )}

          {!suggestionsLoading && searchSuggestions.map((product) => (
            <button
              key={product._id}
              onClick={() => handleSuggestionClick(product._id)}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-input-bg)] transition-colors duration-200 cursor-pointer'
            >
              <div className='w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0'>
                {product.image ? (
                  <img src={product.image} alt={product.title} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-[10px] text-zinc-500'>No Img</div>
                )}
              </div>
              <div className='min-w-0'>
                <p className='text-sm text-[var(--color-text-primary)] font-medium line-clamp-1'>{product.title}</p>
                <p className='text-xs text-emerald-400 font-semibold'>₹{(product.price ?? 0).toLocaleString('en-IN')}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const renderCategoryStrip = () => (
    <div className='mt-3 pt-3 border-t border-[var(--color-border)]'>
      <div
        className='overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden'
        style={{ scrollbarWidth: 'none' }}
      >
        <div className='w-max min-w-full flex items-center justify-center gap-2 md:gap-3'>
          <div className='hidden md:flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-semibold text-[var(--color-text-primary)] bg-[var(--color-input-bg)] border border-[var(--color-input-border)]'>
            <Menu size={14} />
            Shop by Categories
          </div>

          <button
            onClick={() => handleCategoryNav(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors duration-200 cursor-pointer ${
              !activeCategory
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--color-input-bg)]'
            }`}
          >
            All
          </button>

          {NAV_CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleCategoryNav(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors duration-200 cursor-pointer ${
                activeCategory === key
                  ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                  : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--color-input-bg)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Guest Navbar ──
  if (!userData) {
    return (
      <nav className='w-full bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50'>
        <div className='flex items-center justify-between gap-3'>
          <div
            onClick={() => navigate(navigationStrings.HOME)}
            className='text-[var(--color-text-primary)] font-bold text-lg tracking-tight cursor-pointer flex-shrink-0'
          >
            Shop<span className='text-emerald-400'>AI</span>
          </div>

          <div className='hidden md:block flex-1 max-w-2xl px-2'>
            {renderSearchBar(desktopSearchRef)}
          </div>

          <div className='flex items-center gap-2 md:gap-3'>
            <button
              onClick={() => setMobileSearchOpen(prev => !prev)}
              aria-label='Open search'
              className='md:hidden text-[var(--color-text-secondary)] hover:text-emerald-400 transition-colors duration-200 cursor-pointer p-1'
            >
              <Search size={19} />
            </button>

            {/* ── Login — outline/secondary style, sized to match the navbar's natural height ── */}
            <button
              onClick={() => navigate(navigationStrings.LOGIN)}
              className='flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-transparent border border-[var(--color-input-border)] hover:border-emerald-500 hover:-translate-y-1 active:scale-95 text-[var(--color-text-primary)] rounded-xl text-sm transition-all duration-300 cursor-pointer'
            >
              Login
            </button>

            {/* ── Sign Up — reuses PrimaryButton, opted into the compact "sm" size for Navbar ── */}
            <PrimaryButton
              text='Sign Up'
              onClick={() => navigate(navigationStrings.SIGNUP)}
              size='sm'
            />
          </div>
        </div>

        {mobileSearchOpen && (
          <div className='md:hidden mt-3'>
            {renderSearchBar(mobileSearchRef, true)}
          </div>
        )}

        {renderCategoryStrip()}
      </nav>
    )
  }

  // ── Authenticated Navbar ──
  return (
    <nav className='w-full bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50'>

      <div className='flex items-center justify-between gap-3'>
        <div
          onClick={() => navigate(navigationStrings.HOME)}
          className='text-[var(--color-text-primary)] font-bold text-lg tracking-tight cursor-pointer flex-shrink-0'
        >
          Shop<span className='text-emerald-400'>AI</span>
        </div>

        <div className='hidden md:block flex-1 max-w-2xl px-2'>
          {renderSearchBar(desktopSearchRef)}
        </div>

        {/* ── Right cluster: Products, Wishlist, Cart, Profile dropdown ── */}
        <div className='flex items-center gap-3 md:gap-5'>
          <button
            onClick={() => setMobileSearchOpen(prev => !prev)}
            aria-label='Open search'
            className='md:hidden text-[var(--color-text-secondary)] hover:text-emerald-400 transition-colors duration-200 cursor-pointer p-1'
          >
            <Search size={19} />
          </button>

          <button
            onClick={() => navigate(navigationStrings.PRODUCTS)}
            className={`text-sm transition-colors duration-200 ${isActive(navigationStrings.PRODUCTS) ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
          >
            Products
          </button>

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
            onClick={() => navigate(navigationStrings.CART)}
            aria-label='Cart'
            className={`relative transition-colors duration-200 cursor-pointer ${isActive(navigationStrings.CART) ? 'text-emerald-400' : 'text-[var(--color-text-secondary)] hover:text-emerald-400'}`}
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
                  onClick={() => { setDropdownOpen(false); navigate(navigationStrings.PROFILE) }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
                >
                  <User size={16} /> Profile
                </button>

                <button
                  onClick={() => { setDropdownOpen(false); navigate(navigationStrings.ORDERS) }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
                >
                  <Package size={16} /> My Orders
                </button>

                {userData?.role === 'admin' && (
                  <button
                    onClick={() => { setDropdownOpen(false); navigate(navigationStrings.ADMIN) }}
                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer'
                  >
                    <Package size={16} /> Admin
                  </button>
                )}

                <button
                  onClick={() => { setDropdownOpen(false); navigate(navigationStrings.SETTINGS) }}
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
      </div>

      {mobileSearchOpen && (
        <div className='md:hidden mt-3'>
          {renderSearchBar(mobileSearchRef, true)}
        </div>
      )}

      {renderCategoryStrip()}

    </nav>
  )
}

export default Navbar
  const getProductDetailRoute = (id) => navigationStrings.PRODUCT_DETAIL.replace(':id', id)
