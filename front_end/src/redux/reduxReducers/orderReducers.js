// src/redux/reduxReducers/orderReducers.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // Razorpay checkout flow
    pendingOrder: null,
    paymentSuccess: false,
    orderLoading: false,
    orderError: null,

    // Order history
    orders: [],
    ordersLoading: false,
    ordersError: null,

    // Seller order management
    sellerOrders: [],
    sellerOrdersLoading: false,
    sellerOrdersError: null,
}

const orderSlice = createSlice({
    name: "order",
    initialState,

    reducers: {
        setPendingOrder: (state, action) => {
            state.pendingOrder = action.payload
        },

        setPaymentSuccess: (state, action) => {
            state.paymentSuccess = action.payload
        },

        resetOrder: (state) => {
            state.pendingOrder = null
            state.orderLoading = false
            state.orderError = null
            state.paymentSuccess = false
        },

        setOrderLoading: (state, action) => {
            state.orderLoading = action.payload
        },

        setOrderError: (state, action) => {
            state.orderError = action.payload
        },

        setOrders: (state, action) => {
            state.orders = action.payload
        },

        setOrdersLoading: (state, action) => {
            state.ordersLoading = action.payload
        },

        setOrdersError: (state, action) => {
            state.ordersError = action.payload
        },

        // Patch a single order in the array (used after cancel)
        updateOrderInList: (state, action) => {
            const updated = action.payload
            const idx = state.orders.findIndex(o => o._id === updated._id)
            if (idx !== -1) state.orders[idx] = updated
        },

        setSellerOrders: (state, action) => {
            state.sellerOrders = action.payload
        },

        setSellerOrdersLoading: (state, action) => {
            state.sellerOrdersLoading = action.payload
        },

        setSellerOrdersError: (state, action) => {
            state.sellerOrdersError = action.payload
        },

        // Patch a single order in the seller's list (used after approve/reject/ship/deliver)
        updateSellerOrderInList: (state, action) => {
            const updated = action.payload
            const idx = state.sellerOrders.findIndex(o => o._id === updated._id)
            if (idx !== -1) state.sellerOrders[idx] = updated
        },
        // Patches the order in whichever list holds it (buyer orders and/or seller orders)
patchOrderStatus: (state, action) => {
    const { orderId, status } = action.payload
    const apply = (order) => {
        order.status = status
        if (status === 'delivered') order.deliveredAt = new Date().toISOString()
    }
    const buyerOrder = state.orders.find(o => o._id === orderId)
    if (buyerOrder) apply(buyerOrder)
    const sellerOrder = state.sellerOrders.find(o => o._id === orderId)
    if (sellerOrder) apply(sellerOrder)
},
    },
})

export const {
    setPendingOrder,
    setPaymentSuccess,
    resetOrder,
    setOrderLoading,
    setOrderError,
    setOrders,
    setOrdersLoading,
    setOrdersError,
    updateOrderInList,
    setSellerOrders,
    setSellerOrdersLoading,
    setSellerOrdersError,
    updateSellerOrderInList,
    patchOrderStatus,
} = orderSlice.actions

export default orderSlice.reducer