// src/redux/reduxActions/sellerActions.js

import axios from "axios"
import { CREATE_PRODUCT_URL, UPDATE_PRODUCT_URL, DELETE_PRODUCT_URL, GET_MY_PRODUCTS_URL, GET_SELLER_DASHBOARD_URL, SUBMIT_SELLER_KYC_URL } from "../../config/urls"
import store from "../reduxStore"
import { fetchUserData } from "./authActions"
import {
    setSellerProducts as _setSellerProducts,
    addSellerProduct,
    updateSellerProduct,
    removeSellerProduct,
    setSellerLoading,
    setSellerError,
    setSellerSuccess,
    clearSellerStatus as _clearSellerStatus,
    setSellerDashboardStats,
    setSellerDashboardLoading,
    setSellerDashboardError,
} from "../reduxReducers/sellerReducers"

const { dispatch } = store

// ── Fetch my products (seller's own products only) ──
export const fetchMyProducts = async () => {
    dispatch(setSellerLoading(true))
    dispatch(setSellerError(null))

    try {
        const { data } = await axios.get(GET_MY_PRODUCTS_URL, { withCredentials: true })
        dispatch(_setSellerProducts(data.data.products))
    } catch (error) {
        dispatch(setSellerError(
            error.response?.data?.message || "Failed to load your products."
        ))
        throw error
    } finally {
        dispatch(setSellerLoading(false))
    }
}

// ── Create product ──
export const createProduct = async (formData) => {
    dispatch(setSellerLoading(true))
    dispatch(setSellerError(null))
    dispatch(setSellerSuccess(null))

    try {
        const { data } = await axios.post(
            CREATE_PRODUCT_URL,
            formData,
            { withCredentials: true }
        )
        dispatch(addSellerProduct(data.data.product))
        dispatch(setSellerSuccess("Product created successfully."))
        return data.data.product
    } catch (error) {
        dispatch(setSellerError(
            error.response?.data?.message || "Failed to create product."
        ))
        throw error
    } finally {
        dispatch(setSellerLoading(false))
    }
}

// ── Update product ──
export const updateProduct = async ({ id, formData }) => {
    dispatch(setSellerLoading(true))
    dispatch(setSellerError(null))
    dispatch(setSellerSuccess(null))

    try {
        const { data } = await axios.put(
            UPDATE_PRODUCT_URL(id),
            formData,
            { withCredentials: true }
        )
        dispatch(updateSellerProduct(data.data.product))
        dispatch(setSellerSuccess("Product updated successfully."))
        return data.data.product
    } catch (error) {
        dispatch(setSellerError(
            error.response?.data?.message || "Failed to update product."
        ))
        throw error
    } finally {
        dispatch(setSellerLoading(false))
    }
}

// ── Delete product ──
export const deleteProduct = async (id) => {
    dispatch(setSellerLoading(true))
    dispatch(setSellerError(null))
    dispatch(setSellerSuccess(null))

    try {
        await axios.delete(
            DELETE_PRODUCT_URL(id),
            { withCredentials: true }
        )
        dispatch(removeSellerProduct(id))
        dispatch(setSellerSuccess("Product deleted successfully."))
        return id
    } catch (error) {
        dispatch(setSellerError(
            error.response?.data?.message || "Failed to delete product."
        ))
        throw error
    } finally {
        dispatch(setSellerLoading(false))
    }
}

export const setSellerProducts = (products) => {
    dispatch(_setSellerProducts(products))
}

export const clearSellerStatus = () => {
    dispatch(_clearSellerStatus())
}

// ── Fetch seller analytics dashboard stats ──
export const fetchSellerDashboardStats = async () => {
    dispatch(setSellerDashboardLoading(true))
    dispatch(setSellerDashboardError(null))

    try {
        const { data } = await axios.get(
            GET_SELLER_DASHBOARD_URL,
            { withCredentials: true }
        )
        dispatch(setSellerDashboardStats(data.data))
        return data.data
    } catch (error) {
        dispatch(setSellerDashboardError(
            error.response?.data?.message || "Failed to fetch seller dashboard stats."
        ))
        throw error
    } finally {
        dispatch(setSellerDashboardLoading(false))
    }
}

export const submitSellerKycDocuments = async (formData) => {
  dispatch(setSellerLoading(true))
  dispatch(setSellerError(null))
  dispatch(setSellerSuccess(null))

  try {
    const { data } = await axios.post(
      SUBMIT_SELLER_KYC_URL,
      formData,
      { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
    )
    dispatch(setSellerSuccess("KYC documents submitted successfully."))
    await fetchUserData() // refreshes userData.sellerDocuments in the auth slice
    return data.data
  } catch (error) {
    dispatch(setSellerError(
      error.response?.data?.message || "Failed to submit documents."
    ))
    throw error
  } finally {
    dispatch(setSellerLoading(false))
  }
}