import { createSlice } from "@reduxjs/toolkit";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    fetchUserOrders,         // Step 13
    cancelOrder              // Step 13
} from "./orderThunks.js";

const initialState = {
    // ── Step 12 — Razorpay ──
    pendingOrder: null,     // holds razorpayOrderId, amount, currency, orderId, keyId
    paymentSuccess: false,  // true after payment verified — triggers cart clear + success screen

    // ── Step 13 — Order History ──
    orders: [],             // all past orders for the logged-in user
    ordersLoading: false,
    ordersError: null,

    // Shared
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,

    reducers: {
        // Call this when checkout modal closes — resets Step 12 state
        resetOrder: (state) => {
            state.pendingOrder = null;
            state.loading = false;
            state.error = null;
            state.paymentSuccess = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // ── Step 12 — Create Razorpay Order ──
            .addCase(createRazorpayOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRazorpayOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingOrder = action.payload;
            })
            .addCase(createRazorpayOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Step 12 — Verify Payment ──
            .addCase(verifyRazorpayPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyRazorpayPayment.fulfilled, (state) => {
                state.loading = false;
                state.paymentSuccess = true;
                state.pendingOrder = null;
            })
            .addCase(verifyRazorpayPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Step 13 — Fetch User Orders ──
            .addCase(fetchUserOrders.pending, (state) => {
                state.ordersLoading = true;
                state.ordersError = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.ordersError = action.payload;
            })

            // ── Step 13 — Cancel Order ──
            // On success, find the order in the array and update its status in place
            // No need to re-fetch the whole list — just patch the one that changed
            .addCase(cancelOrder.pending, (state) => {
                state.ordersError = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.orders.findIndex(o => o._id === updated._id);
                if (idx !== -1) state.orders[idx] = updated;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.ordersError = action.payload;
            });
    },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;