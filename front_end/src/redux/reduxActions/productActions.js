// src/redux/reduxActions/productActions.js
//
// OLD: createAsyncThunk handled pending/fulfilled/rejected automatically
//
// NEW: Plain async functions.
//      We call dispatch() ourselves at exactly the right moment.
//      This gives us full control over loading states, error handling,
//      and what happens between API call and state update.

import axios from "axios"
import { SERVER_URL } from "../../utils/APIConfig"
import { GET_ALL_PRODUCTS_URL,GET_PRODUCT_BY_ID_URL } from "../../config/urls"
import store from "../reduxStore"
import {
    setProducts,
    setSelectedProduct,
    setProductsLoading,
    setProductLoading,
    setProductsError,
} from "../reduxReducers/productReducers"

const { dispatch } = store

// ── Fetch all products ──
// Used by: Home.jsx (featured section), ProductListing.jsx, Admin.jsx
export const fetchProducts = async () => {
    dispatch(setProductsLoading(true))
    dispatch(setProductsError(null))

    try {
        const { data } = await axios.get(GET_ALL_PRODUCTS_URL)
        dispatch(setProducts(data.products))
        return data.products
    } catch (error) {
        dispatch(setProductsError(
            error.response?.data?.message || "Failed to fetch products"
        ))
        throw error
    } finally {
        // finally always runs — loading resets whether success or failure
        dispatch(setProductsLoading(false))
    }
}

// ── Fetch single product by ID ──
// Used by: ProductDetail.jsx
export const fetchProductById = async (id) => {
    dispatch(setProductLoading(true))
    dispatch(setProductsError(null))

    try {
        const { data } = await axios.get(GET_PRODUCT_BY_ID_URL(id))
        dispatch(setSelectedProduct(data.product))
        return data.product
    } catch (error) {
        dispatch(setProductsError(
            error.response?.data?.message || "Failed to fetch product"
        ))
        throw error
    } finally {
        dispatch(setProductLoading(false))
    }
}