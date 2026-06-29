import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../utils/APIConfig.js";

// ── fetchCart ──
// silent: true  → called internally by updateCart/removeCartItem
//                 slice will NOT set cartLoading: true → no flash
// silent: false → called on mount by Cart.jsx
//                 slice WILL set cartLoading: true → full page spinner shown once
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async ({ silent = false } = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                SERVER_URL + "/cart/",
                { withCredentials: true }
            );
            return { products: data.products || [], silent };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
        try {
            await axios.put(
                SERVER_URL + "/cart/update",
                { productId, quantity },
                { withCredentials: true }
            );
            // silent: true — don't show full page spinner
            dispatch(fetchCart({ silent: true }));
            return productId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cart"
            );
        }
    }
);

export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            await axios.delete(
                SERVER_URL + "/cart/remove/" + productId,
                { withCredentials: true }
            );
            // silent: true — don't show full page spinner
            dispatch(fetchCart({ silent: true }));
            return productId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove item"
            );
        }
    }
);

export const clearEntireCart = createAsyncThunk(
    "cart/clearEntireCart",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await axios.delete(
                SERVER_URL + "/cart/clear",
                { withCredentials: true }
            );
            dispatch(fetchCart({ silent: true }));
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to clear cart"
            );
        }
    }
);

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                SERVER_URL + "/cart/add",
                { productId, quantity },
                { withCredentials: true }
            );
            await dispatch(fetchCart({ silent: true }));
            return data.message;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to cart."
            );
        }
    }
);