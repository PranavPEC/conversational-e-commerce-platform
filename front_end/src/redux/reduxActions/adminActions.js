// src/redux/reduxActions/adminActions.js

import axios from "axios"
import { SERVER_URL } from "../../utils/APIConfig"
import { CREATE_PRODUCT_URL,UPDATE_PRODUCT_URL,DELETE_PRODUCT_URL } from "../../config/urls"
import store from "../reduxStore"
import {
    setAdminProducts as _setAdminProducts,
    addAdminProduct,
    updateAdminProduct,
    removeAdminProduct,
    setAdminLoading,
    setAdminError,
    setAdminSuccess,
    clearAdminStatus as _clearAdminStatus,
} from "../reduxReducers/adminReducers"

const { dispatch } = store

// ── Create product ──
export const createProduct = async (formData) => {
    dispatch(setAdminLoading(true))
    dispatch(setAdminError(null))
    dispatch(setAdminSuccess(null))

    try {
        const { data } = await axios.post(
            CREATE_PRODUCT_URL,
            formData,
            { withCredentials: true }
        )
        dispatch(addAdminProduct(data.product))
        dispatch(setAdminSuccess("Product created successfully."))
        return data.product
    } catch (error) {
        dispatch(setAdminError(
            error.response?.data?.message || "Failed to create product."
        ))
        throw error
    } finally {
        dispatch(setAdminLoading(false))
    }
}

// ── Update product ──
export const updateProduct = async ({ id, formData }) => {
    dispatch(setAdminLoading(true))
    dispatch(setAdminError(null))
    dispatch(setAdminSuccess(null))

    try {
        const { data } = await axios.put(
            UPDATE_PRODUCT_URL(id),
            formData,
            { withCredentials: true }
        )
        dispatch(updateAdminProduct(data.product))
        dispatch(setAdminSuccess("Product updated successfully."))
        return data.product
    } catch (error) {
        dispatch(setAdminError(
            error.response?.data?.message || "Failed to update product."
        ))
        throw error
    } finally {
        dispatch(setAdminLoading(false))
    }
}

// ── Delete product ──
export const deleteProduct = async (id) => {
    dispatch(setAdminLoading(true))
    dispatch(setAdminError(null))
    dispatch(setAdminSuccess(null))

    try {
        await axios.delete(
            DELETE_PRODUCT_URL(id),
            { withCredentials: true }
        )
        dispatch(removeAdminProduct(id))
        dispatch(setAdminSuccess("Product deleted successfully."))
        return id
    } catch (error) {
        dispatch(setAdminError(
            error.response?.data?.message || "Failed to delete product."
        ))
        throw error
    } finally {
        dispatch(setAdminLoading(false))
    }
}

export const setAdminProducts = (products) => {
    dispatch(_setAdminProducts(products))
}

export const clearAdminStatus = () => {
    dispatch(_clearAdminStatus())
}