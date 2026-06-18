import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../api/config.js";

// ── Step 12 — Create Razorpay order ──
export const createRazorpayOrder = createAsyncThunk(
    "order/createRazorpayOrder",
    async ({ address }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                SERVER_URL + "/payment/create-order",
                { address },
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create order."
            );
        }
    }
);

// ── Step 12 — Verify payment signature ──
export const verifyRazorpayPayment = createAsyncThunk(
    "order/verifyRazorpayPayment",
    async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                SERVER_URL + "/payment/verify",
                { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId },
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Payment verification failed."
            );
        }
    }
);

// ── Step 13 — Fetch all orders for logged-in user ──
// Route: GET /order/myorders
// Response shape: { orders: [...] }  ← backend wraps in object, so we unwrap here
export const fetchUserOrders = createAsyncThunk(
    "order/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                SERVER_URL + "/order/myorders",
                { withCredentials: true }
            );
            return data.orders;   // unwrap — slice stores the array directly
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch orders."
            );
        }
    }
);

// ── Step 13 — Cancel an order (only works if status is "placed") ──
// Route: PUT /order/cancel/:id
export const cancelOrder = createAsyncThunk(
    "order/cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                SERVER_URL + "/order/cancel/" + orderId,
                {},
                { withCredentials: true }
            );
            return data.order;   // backend returns updated order
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to cancel order."
            );
        }
    }
);