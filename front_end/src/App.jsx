import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css'

import SignUp from './pages/signup/SignUp.jsx';
import Login from './pages/login/Login.jsx';
import Home from './pages/home/Home.jsx';
import ProductListing from './pages/ProductListing.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/orders/Orders.jsx';
import Admin from './pages/admin/Admin.jsx';
import Navbar from './components/Navbar.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

// ── New architecture: fetchUserData is a plain async function ──
// It dispatches internally via store.dispatch — we do NOT wrap it in dispatch()
import { fetchUserData } from './redux/reduxActions'

function App() {

  const { userData, authLoading } = useSelector(state => state.auth)

  useEffect(() => {
    // Call directly — no dispatch() wrapper needed
    // fetchUserData() handles its own dispatching internally
    fetchUserData()

    // bfcache fix — re-validate auth when browser restores frozen page
    const handlePageShow = (event) => {
      if (event.persisted) fetchUserData()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const location = useLocation()
  const hideNavbar = ['/login', '/signup'].includes(location.pathname)

  if (authLoading) return null

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ── Public routes ── */}
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<ProductListing />} />
        <Route path='/product/:id' element={<ProductDetail />} />

        {/* ── Protected routes ── */}
        <Route path='/home' element={userData ? <Home /> : <Navigate to='/login' />} />
        <Route path='/cart' element={userData ? <Cart /> : <Navigate to='/login' />} />
        <Route path='/orders' element={userData ? <Orders /> : <Navigate to='/login' />} />

        {/* Admin — logged in AND role === admin */}
        <Route
          path='/admin'
          element={
            userData
              ? userData.role === 'admin'
                ? <Admin />
                : <Navigate to='/home' />
              : <Navigate to='/login' />
          }
        />

        <Route path='/*' element={userData ? <Home /> : <ProductListing />} />

      </Routes>
    </>
  )
}

export default App