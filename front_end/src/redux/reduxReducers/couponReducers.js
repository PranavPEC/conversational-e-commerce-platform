import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    coupons: [],
    couponLoading: false,
    couponError: null,
    couponSuccess: null,
}

const couponSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        setCoupons: (state, action) => { state.coupons = action.payload },
        addCoupon: (state, action) => { state.coupons.unshift(action.payload) },
        updateCouponInList: (state, action) => {
            const idx = state.coupons.findIndex(c => c._id === action.payload._id)
            if (idx !== -1) state.coupons[idx] = action.payload
        },
        removeCouponFromList: (state, action) => {
            state.coupons = state.coupons.filter(c => c._id !== action.payload)
        },
        setCouponMgmtLoading: (state, action) => { state.couponLoading = action.payload },
        setCouponMgmtError: (state, action) => { state.couponError = action.payload },
        setCouponMgmtSuccess: (state, action) => { state.couponSuccess = action.payload },
        clearCouponMgmtStatus: (state) => {
            state.couponError = null
            state.couponSuccess = null
        },
    },
})

export const {
    setCoupons, addCoupon, updateCouponInList, removeCouponFromList,
    setCouponMgmtLoading, setCouponMgmtError, setCouponMgmtSuccess, clearCouponMgmtStatus,
} = couponSlice.actions
export default couponSlice.reducer