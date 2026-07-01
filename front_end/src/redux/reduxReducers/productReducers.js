// src/redux/reduxReducers/productReducers.js
//
// OLD: productSlice.js had extraReducers listening for
//      fetchProducts.pending / fulfilled / rejected
//      fetchProductById.pending / fulfilled / rejected
//
// NEW: No extraReducers at all.
//      productActions.js dispatches these reducer actions directly
//      after each API call succeeds or fails.
//      The reducer is a pure, dumb state container — nothing async here.

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products: [],
    selectedProduct: null,
    productsLoading: false,   // for product listing page
    productLoading: false,    // for single product detail page
    error: null,
}

const productSlice = createSlice({
    name: "products",
    initialState,

    reducers: {
        // Called after fetchProducts API succeeds
        setProducts: (state, action) => {
            state.products = action.payload
        },

        // Called after fetchProductById API succeeds
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },

        // Called when user leaves ProductDetail page
        clearSelectedProduct: (state) => {
            state.selectedProduct = null
        },

        // Separate loading flags for list vs detail
        // So ProductListing spinner doesn't affect ProductDetail and vice versa
        setProductsLoading: (state, action) => {
            state.productsLoading = action.payload
        },

        setProductLoading: (state, action) => {
            state.productLoading = action.payload
        },

        setProductsError: (state, action) => {
            state.error = action.payload
        },
    },
    // ← No extraReducers. That's the entire point of this architecture.
})

export const {
    setProducts,
    setSelectedProduct,
    clearSelectedProduct,
    setProductsLoading,
    setProductLoading,
    setProductsError,
} = productSlice.actions

export default productSlice.reducer