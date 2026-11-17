// src/redux/reduxActions/adminActions.js

import axios from "axios"
import { GET_ADMIN_DASHBOARD_URL, GET_SELLER_APPLICATIONS_URL, UPDATE_SELLER_STATUS_URL } from "../../config/urls"
import store from "../reduxStore"
import {
    setDashboardStats,
    setDashboardLoading,
    setDashboardError,
    setSellerApplications,
    setSellerApplicationsLoading,
    setSellerApplicationsError,
    updateSellerApplicationInList,
} from "../reduxReducers/adminReducers"

const { dispatch } = store

// ── Fetch platform-wide dashboard stats for admins ──
export const fetchDashboardStats = async () => {
    dispatch(setDashboardLoading(true))
    dispatch(setDashboardError(null))

    try {
        const { data } = await axios.get(
            GET_ADMIN_DASHBOARD_URL,
            { withCredentials: true }
        )
        dispatch(setDashboardStats(data.data))
        return data.data
    } catch (error) {
        dispatch(setDashboardError(
            error.response?.data?.message || "Failed to fetch dashboard stats."
        ))
        throw error
    } finally {
        dispatch(setDashboardLoading(false))
    }
}

// ── Fetch seller applications for admins ──
export const fetchSellerApplications = async () => {
    dispatch(setSellerApplicationsLoading(true))
    dispatch(setSellerApplicationsError(null))

    try {
        const { data } = await axios.get(
            GET_SELLER_APPLICATIONS_URL,
            { withCredentials: true }
        )
        dispatch(setSellerApplications(data.data.sellers))
        return data.data.sellers
    } catch (error) {
        dispatch(setSellerApplicationsError(
            error.response?.data?.message || "Failed to fetch seller applications."
        ))
        throw error
    } finally {
        dispatch(setSellerApplicationsLoading(false))
    }
}

// ── Update seller application status ──
export const updateSellerApplicationStatus = async (sellerId, status) => {
    dispatch(setSellerApplicationsError(null))

    try {
        const { data } = await axios.put(
            UPDATE_SELLER_STATUS_URL(sellerId),
            { status },
            { withCredentials: true }
        )
        dispatch(updateSellerApplicationInList(data.data.seller))
        return data.data.seller
    } catch (error) {
        dispatch(setSellerApplicationsError(
            error.response?.data?.message || "Failed to update seller status."
        ))
        throw error
    }
}
