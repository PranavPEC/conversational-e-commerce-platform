// src/redux/reduxReducers/adminReducers.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products: [],
    adminLoading: false,
    adminError: null,
    adminSuccess: null,
}

const adminSlice = createSlice({
    name: "admin",
    initialState,

    reducers: {
        setAdminProducts: (state, action) => {
            state.products = action.payload
        },

        // Called after create — new product added to top of list
        addAdminProduct: (state, action) => {
            state.products.unshift(action.payload)
        },

        // Called after update — find by _id and replace in place
        updateAdminProduct: (state, action) => {
            const idx = state.products.findIndex(p => p._id === action.payload._id)
            if (idx !== -1) state.products[idx] = action.payload
        },

        // Called after delete — filter out by id
        removeAdminProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload)
        },

        setAdminLoading: (state, action) => {
            state.adminLoading = action.payload
        },

        setAdminError: (state, action) => {
            state.adminError = action.payload
        },

        setAdminSuccess: (state, action) => {
            state.adminSuccess = action.payload
        },

        clearAdminStatus: (state) => {
            state.adminError = null
            state.adminSuccess = null
        },
    },
})

export const {
    setAdminProducts,
    addAdminProduct,
    updateAdminProduct,
    removeAdminProduct,
    setAdminLoading,
    setAdminError,
    setAdminSuccess,
    clearAdminStatus,
} = adminSlice.actions

export default adminSlice.reducer