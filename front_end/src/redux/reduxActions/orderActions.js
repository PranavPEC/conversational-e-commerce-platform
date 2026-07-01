// src/redux/reduxActions/orderActions.js

import axios from "axios"
import { SERVER_URL } from "../../utils/APIConfig"
import store from "../reduxStore"
import {
    setPendingOrder,
    setPaymentSuccess,
    resetOrder,
    setOrderLoading,
    setOrderError,
    setOrders,
    setOrdersLoading,
    setOrdersError,
    updateOrderInList,
} from "../reduxReducers/orderReducers"

const { dispatch } = store

// ── Create Razorpay order ──
// Returns the pendingOrder object that CheckoutModal uses to open Razorpay SDK
export const createRazorpayOrder = async ({ address }) => {
    dispatch(setOrderLoading(true))
    dispatch(setOrderError(null))

    try {
        const { data } = await axios.post(
            SERVER_URL + "/payment/create-order",
            { address },
            { withCredentials: true }
        )
        dispatch(setPendingOrder(data))
        return data
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to create order."
        dispatch(setOrderError(msg))
        throw error
    } finally {
        dispatch(setOrderLoading(false))
    }
}

// ── Verify Razorpay payment signature ──
// Called after Razorpay SDK handler fires with payment proof
export const verifyRazorpayPayment = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
}) => {
    dispatch(setOrderLoading(true))
    dispatch(setOrderError(null))

    try {
        const { data } = await axios.post(
            SERVER_URL + "/payment/verify",
            { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId },
            { withCredentials: true }
        )
        dispatch(setPaymentSuccess(true))
        dispatch(setPendingOrder(null))
        return data
    } catch (error) {
        const msg = error.response?.data?.message || "Payment verification failed."
        dispatch(setOrderError(msg))
        throw error
    } finally {
        dispatch(setOrderLoading(false))
    }
}

// ── Fetch all orders for logged-in user ──
export const fetchUserOrders = async () => {
    dispatch(setOrdersLoading(true))
    dispatch(setOrdersError(null))

    try {
        const { data } = await axios.get(
            SERVER_URL + "/order/myorders",
            { withCredentials: true }
        )
        dispatch(setOrders(data.orders))
        return data.orders
    } catch (error) {
        dispatch(setOrdersError(
            error.response?.data?.message || "Failed to fetch orders."
        ))
        throw error
    } finally {
        dispatch(setOrdersLoading(false))
    }
}

// ── Cancel an order ──
export const cancelOrder = async (orderId) => {
    dispatch(setOrdersError(null))

    try {
        const { data } = await axios.put(
            SERVER_URL + "/order/cancel/" + orderId,
            {},
            { withCredentials: true }
        )
        // Patch just this one order in the list — no need to re-fetch all
        dispatch(updateOrderInList(data.order))
        return data.order
    } catch (error) {
        dispatch(setOrdersError(
            error.response?.data?.message || "Failed to cancel order."
        ))
        throw error
    }
}

// ── Reset order state (called when checkout modal closes) ──
export { resetOrder }