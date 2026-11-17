// src/redux/reduxReducers/adminReducers.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    dashboardStats: null,
    dashboardLoading: false,
    dashboardError: null,
    sellerApplications: [],
    sellerApplicationsLoading: false,
    sellerApplicationsError: null,
}

const adminSlice = createSlice({
    name: "admin",
    initialState,

    reducers: {
        setDashboardStats: (state, action) => {
            state.dashboardStats = action.payload
        },

        setDashboardLoading: (state, action) => {
            state.dashboardLoading = action.payload
        },

        setDashboardError: (state, action) => {
            state.dashboardError = action.payload
        },

        setSellerApplications: (state, action) => {
            state.sellerApplications = action.payload
        },

        setSellerApplicationsLoading: (state, action) => {
            state.sellerApplicationsLoading = action.payload
        },

        setSellerApplicationsError: (state, action) => {
            state.sellerApplicationsError = action.payload
        },

        updateSellerApplicationInList: (state, action) => {
            const updated = action.payload
            const idx = state.sellerApplications.findIndex(seller => seller._id === updated._id)
            if (idx !== -1) state.sellerApplications[idx] = updated
        },
    },
})

export const {
    setDashboardStats,
    setDashboardLoading,
    setDashboardError,
    setSellerApplications,
    setSellerApplicationsLoading,
    setSellerApplicationsError,
    updateSellerApplicationInList,
} = adminSlice.actions

export default adminSlice.reducer
