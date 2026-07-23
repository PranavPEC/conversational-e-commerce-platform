import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Navbar from '../components/Navbar.jsx'
import Footer from '../components/common_components/Footer.jsx'
import Home from '../pages/home/Home.jsx'
import SignUp from '../pages/signup/SignUp.jsx'
import Login from '../pages/login/Login.jsx'
import ProductListing from '../pages/ProductListing.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import Cart from '../pages/Cart.jsx'
import Orders from '../pages/orders/Orders.jsx'
import Profile from '../pages/profile/Profile.jsx'
import Settings from '../pages/settings/Settings.jsx'
import Admin from '../pages/admin/Admin.jsx'
import ForgotPassword from '../pages/forgot_password/ForgotPassword.jsx'
import VerifyOTP from '../pages/forgot_password/VerifyOTP.jsx'
import ResetPassword from '../pages/forgot_password/ResetPassword.jsx'
import navigationStrings from '../constants/navigationStrings/navigationStrings.js'

const APP_ROUTES = [
    { path: navigationStrings.HOME, element: <Home /> },
    { path: navigationStrings.SIGNUP, element: <SignUp /> },
    { path: navigationStrings.LOGIN, element: <Login /> },
    { path: navigationStrings.FORGOT_PASSWORD, element: <ForgotPassword /> },
    { path: navigationStrings.VERIFY_OTP, element: <VerifyOTP /> },
    { path: navigationStrings.RESET_PASSWORD, element: <ResetPassword /> },
    { path: navigationStrings.PRODUCTS, element: <ProductListing /> },
    { path: navigationStrings.PRODUCT_DETAIL, element: <ProductDetail /> },
    { path: navigationStrings.CART, element: <Cart />, protected: true },
    { path: navigationStrings.ORDERS, element: <Orders />, protected: true },
    { path: navigationStrings.PROFILE, element: <Profile />, protected: true },
    { path: navigationStrings.SETTINGS, element: <Settings />, protected: true },
    { path: navigationStrings.ADMIN, element: <Admin />, protected: true, adminOnly: true },
]

const HIDE_NAVBAR_PATHS = [
    navigationStrings.LOGIN,
    navigationStrings.SIGNUP,
    navigationStrings.FORGOT_PASSWORD,
    navigationStrings.VERIFY_OTP,
    navigationStrings.RESET_PASSWORD,
]

const resolveElement = (route, userData) => {
    if (route.adminOnly) {
        if (!userData) return <Navigate to={navigationStrings.LOGIN} />
        return userData.role === 'admin' ? route.element : <Navigate to={navigationStrings.HOME} />
    }
    if (route.protected) {
        return userData ? route.element : <Navigate to={navigationStrings.LOGIN} />
    }
    return route.element
}

function AppRouter() {
    const { userData } = useSelector((state) => state.auth)
    const location = useLocation()
    const hideNavbar = HIDE_NAVBAR_PATHS.includes(location.pathname)

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                {APP_ROUTES.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={resolveElement(route, userData)}
                    />
                ))}
                <Route path='/*' element={userData ? <Home /> : <ProductListing />} />
            </Routes>

            {!hideNavbar && <Footer />}
        </>
    )
}

export default AppRouter
