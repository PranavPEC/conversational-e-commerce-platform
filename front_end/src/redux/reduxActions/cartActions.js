// src/redux/reduxActions/cartActions.js
//
// The silent flag flash-fix that previously lived in extraReducers
// now lives HERE in the action itself — we simply don't call
// setCartLoading(true) when silent is true.
// The reducer is completely unaware of the silent concept.

import axios from "axios"
import { GET_CART_URL,ADD_TO_CART_URL,UPDATE_CART_URL,REMOVE_CART_ITEM_URL,CLEAR_CART_URL, APPLY_COUPON_URL, REMOVE_COUPON_URL } from "../../config/urls"
import store from "../reduxStore"
import {
    setCartItems,
    setCartLoading,
    setItemLoading,
    setCartError,
    clearCart,
    setCartPricing,
    setCouponLoading,
    setCouponError,
} from "../reduxReducers/cartReducers"

const { dispatch } = store

// ── Internal helper: fetch cart from backend ──
// silent: false → sets cartLoading: true → shows full page spinner (mount only)
// silent: true  → skips cartLoading → no flash during +/-
const _fetchCartFromAPI = async (silent = false) => {
    if (!silent) dispatch(setCartLoading(true))
    dispatch(setCartError(null))

    try {
        const { data } = await axios.get(GET_CART_URL, { withCredentials: true })
        dispatch(setCartItems(data.data.cart?.products || []))
        dispatch(setCartPricing(data.data.pricing || { subtotal: 0, discountAmount: 0, total: 0, couponCode: null }))
        return data.data // now returned so callers can read couponRemoved
    } catch (error) {
        dispatch(setCartError(
            error.response?.data?.message || "Failed to fetch cart"
        ))
        throw error
    } finally {
        if (!silent) dispatch(setCartLoading(false))
    }
}

// ── Public actions ──

// Called on Cart.jsx mount — shows full page spinner
export const fetchCart = async () => {
    return await _fetchCartFromAPI(false)
}

// ── Add to cart ──
export const addCartItem = async ({ productId, quantity }) => {
    try {
        const { data } = await axios.post(
            ADD_TO_CART_URL,
            { productId, quantity },
            { withCredentials: true }
        )
        // Silent refresh — cart updates without full page spinner
        await _fetchCartFromAPI(true)
        return { success: true, message: data.message }
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to add to cart."
        dispatch(setCartError(msg))
        throw error
    }
}

// ── Update quantity — per-item loading so only that item's buttons disable ──
export const updateCart = async ({ productId, quantity }) => {
    dispatch(setItemLoading({ productId, value: true }))

    try {
        await axios.put(
            UPDATE_CART_URL,
            { productId, quantity },
            { withCredentials: true }
        )
        await _fetchCartFromAPI(true)   // silent — no flash
    } catch (error) {
        dispatch(setCartError(
            error.response?.data?.message || "Failed to update cart"
        ))
        throw error
    } finally {
        dispatch(setItemLoading({ productId, value: false }))
    }
}

// ── Remove item — per-item loading ──
export const removeCartItem = async (productId) => {
    dispatch(setItemLoading({ productId, value: true }))

    try {
        await axios.delete(
            REMOVE_CART_ITEM_URL(productId),
            { withCredentials: true }
        )
        await _fetchCartFromAPI(true)   // silent — no flash
    } catch (error) {
        dispatch(setCartError(
            error.response?.data?.message || "Failed to remove item"
        ))
        throw error
    } finally {
        dispatch(setItemLoading({ productId, value: false }))
    }
}

// ── Clear entire cart ──
export const clearEntireCart = async () => {
    try {
        await axios.delete(CLEAR_CART_URL, { withCredentials: true })
        await _fetchCartFromAPI(true)
    } catch (error) {
        dispatch(setCartError(
            error.response?.data?.message || "Failed to clear cart"
        ))
        throw error
    }
}

export const applyCoupon = async (code) => {
    dispatch(setCouponLoading(true))
    dispatch(setCouponError(null))

    try {
        const { data } = await axios.post(APPLY_COUPON_URL, { code }, { withCredentials: true })
        await _fetchCartFromAPI(true)
        return data
    } catch (error) {
        dispatch(setCouponError(
            error.response?.data?.message || "Failed to apply coupon."
        ))
        throw error
    } finally {
        dispatch(setCouponLoading(false))
    }
}

export const removeCoupon = async () => {
    dispatch(setCouponLoading(true))
    dispatch(setCouponError(null))

    try {
        await axios.post(REMOVE_COUPON_URL, {}, { withCredentials: true })
        return await _fetchCartFromAPI(true)
    } catch (error) {
        dispatch(setCouponError(
            error.response?.data?.message || "Failed to remove coupon."
        ))
        throw error
    } finally {
        dispatch(setCouponLoading(false))
    }
}

// Re-export clearCart so Navbar can import it from reduxActions barrel
export { clearCart }