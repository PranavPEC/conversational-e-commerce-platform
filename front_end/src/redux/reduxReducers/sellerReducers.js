// src/redux/reduxReducers/sellerReducers.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products: [],
    sellerLoading: false,
    sellerError: null,
    sellerSuccess: null,
    dashboardStats: null,
    dashboardLoading: false,
    dashboardError: null,
}

const sellerSlice = createSlice({
    name: "seller",
    initialState,

    reducers: {
        setSellerProducts: (state, action) => {
            state.products = action.payload
        },

        // Called after create — new product added to top of list
        addSellerProduct: (state, action) => {
            state.products.unshift(action.payload)
        },

        // Called after update — find by _id and replace in place
        updateSellerProduct: (state, action) => {
            const idx = state.products.findIndex(p => p._id === action.payload._id)
            if (idx !== -1) state.products[idx] = action.payload
        },

        // Called after delete — filter out by id
        removeSellerProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload)
        },

        setSellerLoading: (state, action) => {
            state.sellerLoading = action.payload
        },

        setSellerError: (state, action) => {
            state.sellerError = action.payload
        },

        setSellerSuccess: (state, action) => {
            state.sellerSuccess = action.payload
        },

        clearSellerStatus: (state) => {
            state.sellerError = null
            state.sellerSuccess = null
        },

        setSellerDashboardStats: (state, action) => {
            state.dashboardStats = action.payload
        },

        setSellerDashboardLoading: (state, action) => {
            state.dashboardLoading = action.payload
        },

        setSellerDashboardError: (state, action) => {
            state.dashboardError = action.payload
        },
    },
})

export const {
    setSellerProducts,
    addSellerProduct,
    updateSellerProduct,
    removeSellerProduct,
    setSellerLoading,
    setSellerError,
    setSellerSuccess,
    clearSellerStatus,
    setSellerDashboardStats,
    setSellerDashboardLoading,
    setSellerDashboardError,
} = sellerSlice.actions

export default sellerSlice.reducer