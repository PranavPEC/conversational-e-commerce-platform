import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../api/config.js";

// ── Create Product ──
export const createProduct = createAsyncThunk(
    "admin/createProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                SERVER_URL + "/product/create",
                formData,           // FormData object — axios auto-sets multipart headers
                { withCredentials: true }
            );
            return data.product;    // backend returns { message, product }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create product."
            );
        }
    }
);

// ── Update Product ──
export const updateProduct = createAsyncThunk(
    "admin/updateProduct",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                SERVER_URL + "/product/update/" + id,
                formData,
                { withCredentials: true }
            );
            return data.product;    // backend returns { message, product }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update product."
            );
        }
    }
);

// ── Delete Product ──
export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                SERVER_URL + "/product/delete/" + id,
                { withCredentials: true }
            );
            return id;              // return the id so slice can filter it out of the array
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete product."
            );
        }
    }
);