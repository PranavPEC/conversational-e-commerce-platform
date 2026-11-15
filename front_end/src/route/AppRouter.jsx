import { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Navbar from '../components/Navbar.jsx'
import Footer from '../components/common_components/Footer.jsx'
import RouteFallback from '../components/common_components/RouteFallback.jsx'
import RouteErrorBoundary from '../components/common_components/RouteErrorBoundary.jsx'
import Home from '../pages/home/Home.jsx'
import {
    SignUp,
    Login,
    ForgotPassword,
    VerifyOTP,
    ResetPassword,
    Terms,
    PrivacyPolicy,
    ProductListing,
    ProductDetail,
    Cart,
    Wishlist,
    Orders,
    Profile,
    Settings,
    Seller,
    SellerOrders,
    SellerDashboard,
    SellerVouchers,
    SellerKycDocuments,
    SellerPendingApproval,
    Admin,
    SellerApplications,
    AdminCoupons,
} from './lazyPages.js'
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
    { path: navigationStrings.TERMS, element: <Terms /> },
    { path: navigationStrings.PRIVACY_POLICY, element: <PrivacyPolicy /> },
    { path: navigationStrings.CART, element: <Cart />, protected: true },
    { path: navigationStrings.ORDERS, element: <Orders />, protected: true },
    { path: navigationStrings.PROFILE, element: <Profile />, protected: true },
    { path: navigationStrings.SETTINGS, element: <Settings />, protected: true },
    { path: navigationStrings.ADMIN, element: <Admin />, protected: true, adminOnly: true },
    { path: navigationStrings.SELLER_APPLICATIONS, element: <SellerApplications />, protected: true, adminOnly: true },
    { path: navigationStrings.SELLER, element: <Seller />, protected: true, sellerOnly: true },
    { path: navigationStrings.SELLER_ORDERS, element: <SellerOrders />, protected: true, sellerOnly: true },
    { path: navigationStrings.SELLER_ANALYTICS, element: <SellerDashboard />, protected: true, sellerOnly: true },
    { path: navigationStrings.SELLER_VOUCHERS, element: <SellerVouchers />, protected: true, sellerOnly: true },
    { path: navigationStrings.ADMIN_COUPONS, element: <AdminCoupons />, protected: true, adminOnly: true },
    { path: navigationStrings.SELLER_KYC_DOCUMENTS, element: <SellerKycDocuments />, protected: true },
    { path: navigationStrings.WISHLIST, element: <Wishlist />, protected: true },
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
    if (route.sellerOnly) {
        if (!userData) return <Navigate to={navigationStrings.LOGIN} />
        const role = userData.role
        if (role === 'admin') return route.element
        if (role === 'seller') {
            return userData.sellerStatus === 'approved' ? route.element : <SellerPendingApproval />
        }
        return <Navigate to={navigationStrings.HOME} />
    }
    if (route.protected) {
        return userData ? route.element : <Navigate to={navigationStrings.LOGIN} />
    }
    return route.element
}

function AppRouter() {
    const { userData } = useSelector((state) => state?.auth)
    const location = useLocation()
    const hideNavbar = HIDE_NAVBAR_PATHS.includes(location.pathname)

    return (
        <>
            {!hideNavbar && <Navbar />}

            <RouteErrorBoundary key={location.pathname}>
                <Suspense fallback={<RouteFallback />}>
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
                </Suspense>
            </RouteErrorBoundary>

            {!hideNavbar && <Footer />}
        </>
    )
}

export default AppRouter
