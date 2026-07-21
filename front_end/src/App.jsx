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
import Profile from './pages/profile/Profile.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/common_components/Footer.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import ForgotPassword from './pages/forgot_password/ForgotPassword.jsx';
import VerifyOTP from './pages/forgot_password/VerifyOTP.jsx';
import ResetPassword from './pages/forgot_password/ResetPassword.jsx';

import { fetchUserData } from './redux/reduxActions'
import { initializeTheme } from './redux/reduxActions'
import Settings from './pages/settings/Settings.jsx'
import navigationStrings from './constants/navigationStrings/navigationStrings.js';

function App() {

  const { userData, authLoading } = useSelector(state => state.auth)

  useEffect(() => {

    fetchUserData()
    initializeTheme()


    const handlePageShow = (event) => {
      if (event.persisted) fetchUserData()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const location = useLocation()
  const hideNavbar = ['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password'].includes(location.pathname)

  if (authLoading) return null

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ── Public routes ── */}
        <Route path={navigationStrings.SIGNUP} element={<SignUp />} />
        <Route path={navigationStrings.LOGIN} element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<ProductListing />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path={navigationStrings.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={navigationStrings.VERIFY_OTP} element={<VerifyOTP />} />
        <Route path={navigationStrings.RESET_PASSWORD} element={<ResetPassword />} />


        {/* ── Protected routes ── */}
        <Route path='/cart' element={userData ? <Cart /> : <Navigate to='/login' />} />
        <Route path='/orders' element={userData ? <Orders /> : <Navigate to='/login' />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to='/login' />} />
        <Route path='/settings' element={userData ? <Settings /> : <Navigate to='/login' />} />

        {/* Admin — logged in AND role === admin */}
        <Route
          path='/admin'
          element={
            userData
              ? userData.role === 'admin'
                ? <Admin />
                : <Navigate to='/' />
              : <Navigate to='/login' />
          }
        />

        <Route path='/*' element={userData ? <Home /> : <ProductListing />} />

      </Routes>

      {!hideNavbar && <Footer />}
    </>
  )
}

export default App
