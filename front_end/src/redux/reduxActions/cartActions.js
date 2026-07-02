// src/redux/reduxActions/cartActions.js
//
// The silent flag flash-fix that previously lived in extraReducers
// now lives HERE in the action itself — we simply don't call
// setCartLoading(true) when silent is true.
// The reducer is completely unaware of the silent concept.

import axios from "axios"
import { SERVER_URL } from "../../utils/APIConfig"
import { GET_CART_URL,ADD_TO_CART_URL,UPDATE_CART_URL,REMOVE_CART_ITEM_URL,CLEAR_CART_URL } from "../../config/urls"
import store from "../reduxStore"
import {
    setCartItems,
    setCartLoading,
    setItemLoading,
    setCartError,
    clearCart,
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
        dispatch(setCartItems(data.products || []))
    } catch (error) {
        dispatch(setCartError(
            error.response?.data?.message || "Failed to fetch cart"
        ))
    } finally {
        if (!silent) dispatch(setCartLoading(false))
    }
}

// ── Public actions ──

// Called on Cart.jsx mount — shows full page spinner
export const fetchCart = async () => {
    await _fetchCartFromAPI(false)
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
        return { success: false, message: msg }
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
    }
}

// Re-export clearCart so Navbar can import it from reduxActions barrel
export { clearCart }