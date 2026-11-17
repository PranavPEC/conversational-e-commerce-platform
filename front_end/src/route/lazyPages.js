import { lazy } from 'react'
import navigationStrings from '../constants/navigationStrings/navigationStrings.js'

function lazyWithPreload(factory) {
    const Component = lazy(factory)
    Component.preload = () => factory().catch(() => {})
    return Component
}

export const SignUp = lazyWithPreload(() => import('../pages/signup/SignUp.jsx'))
export const Login = lazyWithPreload(() => import('../pages/login/Login.jsx'))
export const ForgotPassword = lazyWithPreload(() => import('../pages/forgot_password/ForgotPassword.jsx'))
export const VerifyOTP = lazyWithPreload(() => import('../pages/forgot_password/VerifyOTP.jsx'))
export const ResetPassword = lazyWithPreload(() => import('../pages/forgot_password/ResetPassword.jsx'))
export const Terms = lazyWithPreload(() => import('../pages/legal/Terms.jsx'))
export const PrivacyPolicy = lazyWithPreload(() => import('../pages/legal/PrivacyPolicy.jsx'))
export const ProductListing = lazyWithPreload(() => import('../pages/ProductListing.jsx'))
export const ProductDetail = lazyWithPreload(() => import('../pages/ProductDetail.jsx'))
export const Cart = lazyWithPreload(() => import('../pages/Cart.jsx'))
export const Wishlist = lazyWithPreload(() => import('../pages/wishlist/Wishlist.jsx'))
export const Orders = lazyWithPreload(() => import('../pages/orders/Orders.jsx'))
export const Profile = lazyWithPreload(() => import('../pages/profile/Profile.jsx'))
export const Settings = lazyWithPreload(() => import('../pages/settings/Settings.jsx'))
export const Seller = lazyWithPreload(() => import('../pages/seller/Seller.jsx'))
export const SellerOrders = lazyWithPreload(() => import('../pages/seller/SellerOrders.jsx'))
export const SellerDashboard = lazyWithPreload(() => import('../pages/seller/SellerDashboard.jsx'))
export const SellerVouchers = lazyWithPreload(() => import('../pages/seller/SellerVouchers.jsx'))
export const SellerKycDocuments = lazyWithPreload(() => import('../pages/seller/SellerKycDocuments.jsx'))
export const SellerPendingApproval = lazyWithPreload(() => import('../pages/seller/SellerPendingApproval.jsx'))
export const Admin = lazyWithPreload(() => import('../pages/admin/Admin.jsx'))
export const SellerApplications = lazyWithPreload(() => import('../pages/admin/SellerApplications.jsx'))
export const AdminCoupons = lazyWithPreload(() => import('../pages/admin/AdminCoupons.jsx'))

export const prefetch = {
    login: () => Login.preload(),
    signup: () => SignUp.preload(),
    products: () => ProductListing.preload(),
    productDetail: () => ProductDetail.preload(),
    cart: () => Cart.preload(),
    wishlist: () => Wishlist.preload(),
    orders: () => Orders.preload(),
    profile: () => Profile.preload(),
    settings: () => Settings.preload(),
    seller: () => Seller.preload(),
    admin: () => Admin.preload(),
}

const PAGES_BY_PATH = new Map([
    [navigationStrings.LOGIN, Login],
    [navigationStrings.SIGNUP, SignUp],
    [navigationStrings.FORGOT_PASSWORD, ForgotPassword],
    [navigationStrings.VERIFY_OTP, VerifyOTP],
    [navigationStrings.RESET_PASSWORD, ResetPassword],
    [navigationStrings.PRODUCTS, ProductListing],
    [navigationStrings.CART, Cart],
    [navigationStrings.ORDERS, Orders],
    [navigationStrings.PROFILE, Profile],
    [navigationStrings.SETTINGS, Settings],
    [navigationStrings.WISHLIST, Wishlist],
    [navigationStrings.TERMS, Terms],
    [navigationStrings.PRIVACY_POLICY, PrivacyPolicy],
    [navigationStrings.ADMIN, Admin],
    [navigationStrings.SELLER_APPLICATIONS, SellerApplications],
    [navigationStrings.ADMIN_COUPONS, AdminCoupons],
    [navigationStrings.SELLER, Seller],
    [navigationStrings.SELLER_ORDERS, SellerOrders],
    [navigationStrings.SELLER_ANALYTICS, SellerDashboard],
    [navigationStrings.SELLER_VOUCHERS, SellerVouchers],
    [navigationStrings.SELLER_KYC_DOCUMENTS, SellerKycDocuments],
])

export function preloadForPath(pathname) {
    const Page = PAGES_BY_PATH.get(pathname)
    if (Page) {
        Page.preload()
    } else if (pathname.startsWith('/product/')) {
        ProductDetail.preload()
    }
}

export function prefetchShoppingFlow(isLoggedIn) {
    const preloadShoppingPages = () => {
        ProductListing.preload()
        ProductDetail.preload()
        if (isLoggedIn) {
            Cart.preload()
            Wishlist.preload()
        }
    }

    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(preloadShoppingPages)
    } else {
        window.setTimeout(preloadShoppingPages, 2000)
    }
}
