// src/redux/reduxReducers/addressReducers.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    addresses: [],
    addressesLoading: false,
    addressesError: null,
}

const addressSlice = createSlice({
    name: "address",
    initialState,

    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload
        },

        setAddressesLoading: (state, action) => {
            state.addressesLoading = action.payload
        },

        setAddressesError: (state, action) => {
            state.addressesError = action.payload
        },
    },
})

export const {
    setAddresses,
    setAddressesLoading,
    setAddressesError,
} = addressSlice.actions

export default addressSlice.reducer