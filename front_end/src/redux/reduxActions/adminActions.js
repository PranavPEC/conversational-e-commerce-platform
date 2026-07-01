// src/redux/reduxActions/adminActions.js

import axios from "axios"
import { SERVER_URL } from "../../utils/APIConfig"
import store from "../reduxStore"
import {
    setAdminProducts,
    addAdminProduct,
    updateAdminProduct,
    removeAdminProduct,
    setAdminLoading,
    setAdminError,
    setAdminSuccess,
    clearAdminStatus,
} from "../reduxReducers/adminReducers"

const { dispatch } = store

// ── Create product ──
export const createProduct = async (formData) => {
    dispatch(setAdminLoading(true))
    dispatch(setAdminError(null))
    dispatch(setAdminSuccess(null))

    try {
        const { data } = await axios.post(
            SERVER_URL + "/product/create",
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
            SERVER_URL + "/product/update/" + id,
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
            SERVER_URL + "/product/delete/" + id,
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

export { setAdminProducts, clearAdminStatus }