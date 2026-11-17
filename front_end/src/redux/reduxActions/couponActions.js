import axios from "axios"
import { CREATE_COUPON_URL, GET_MY_COUPONS_URL, UPDATE_COUPON_STATUS_URL, DELETE_COUPON_URL } from "../../config/urls"
import store from "../reduxStore"
import {
    setCoupons, addCoupon, updateCouponInList, removeCouponFromList,
    setCouponMgmtLoading, setCouponMgmtError, setCouponMgmtSuccess,
} from "../reduxReducers/couponReducers"

const { dispatch } = store

export const fetchMyCoupons = async () => {
    dispatch(setCouponMgmtLoading(true))
    dispatch(setCouponMgmtError(null))
    dispatch(setCouponMgmtSuccess(null))
    try {
        const { data } = await axios.get(GET_MY_COUPONS_URL, { withCredentials: true })
        dispatch(setCoupons(data.data.coupons))
    } catch (error) {
        dispatch(setCouponMgmtError(error.response?.data?.message || "Failed to load coupons."))
        throw error
    } finally {
        dispatch(setCouponMgmtLoading(false))
    }
}

export const createCoupon = async (payload) => {
    dispatch(setCouponMgmtLoading(true))
    dispatch(setCouponMgmtError(null))
    dispatch(setCouponMgmtSuccess(null))
    try {
        const { data } = await axios.post(CREATE_COUPON_URL, payload, { withCredentials: true })
        dispatch(addCoupon(data.data.coupon))
        dispatch(setCouponMgmtSuccess("created_success"))
        return data.data.coupon
    } catch (error) {
        dispatch(setCouponMgmtError(error.response?.data?.message || "Failed to create coupon."))
        throw error
    } finally {
        dispatch(setCouponMgmtLoading(false))
    }
}

export const toggleCouponStatus = async ({ id, isActive }) => {
    dispatch(setCouponMgmtLoading(true))
    dispatch(setCouponMgmtError(null))
    dispatch(setCouponMgmtSuccess(null))
    try {
        const { data } = await axios.put(UPDATE_COUPON_STATUS_URL(id), { isActive }, { withCredentials: true })
        dispatch(updateCouponInList(data.data.coupon))
        dispatch(setCouponMgmtSuccess("updated_success"))
    } catch (error) {
        dispatch(setCouponMgmtError(error.response?.data?.message || "Failed to update coupon."))
        throw error
    } finally {
        dispatch(setCouponMgmtLoading(false))
    }
}

export const deleteCoupon = async (id) => {
    dispatch(setCouponMgmtLoading(true))
    dispatch(setCouponMgmtError(null))
    dispatch(setCouponMgmtSuccess(null))
    try {
        await axios.delete(DELETE_COUPON_URL(id), { withCredentials: true })
        dispatch(removeCouponFromList(id))
        dispatch(setCouponMgmtSuccess("deleted_success"))
    } catch (error) {
        dispatch(setCouponMgmtError(error.response?.data?.message || "Failed to delete coupon."))
        throw error
    } finally {
        dispatch(setCouponMgmtLoading(false))
    }
}