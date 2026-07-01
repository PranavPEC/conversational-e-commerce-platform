// src/redux/reduxReducers/cartReducers.js
//
// The cart had a clever "silent" flag to prevent full-page flash during +/-.
// In the old architecture, this was handled in extraReducers via action.meta.arg.
// In the new architecture, cartActions.js handles the silent logic itself
// and dispatches the right loading state directly.
//
// cartLoading — only true on initial mount fetch (shows full page spinner)
// itemLoading — { [productId]: true } for per-item +/- operations

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartCount: 0,
    cartItems: [],
    cartLoading: false,
    itemLoading: {},
    error: null,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload
            state.cartCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
        },

        setCartLoading: (state, action) => {
            state.cartLoading = action.payload
        },

        // { productId, value } — sets one item's loading state
        setItemLoading: (state, action) => {
            const { productId, value } = action.payload
            state.itemLoading[productId] = value
        },

        setCartError: (state, action) => {
            state.error = action.payload
        },

        setCartCount: (state, action) => {
            state.cartCount = action.payload
        },

        clearCartCount: (state) => {
            state.cartCount = 0
        },

        clearCart: (state) => {
            state.cartItems = []
            state.cartCount = 0
            state.itemLoading = {}
            state.error = null
        },
    },
    // No extraReducers
})

export const {
    setCartItems,
    setCartLoading,
    setItemLoading,
    setCartError,
    setCartCount,
    clearCartCount,
    clearCart,
} = cartSlice.actions

export default cartSlice.reducer