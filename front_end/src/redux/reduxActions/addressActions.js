// src/redux/reduxActions/addressActions.js

import axios from "axios"
import {
    ADD_ADDRESS_URL,
    GET_MY_ADDRESSES_URL,
    UPDATE_ADDRESS_URL,
    DELETE_ADDRESS_URL,
    SET_DEFAULT_ADDRESS_URL,
} from "../../config/urls"
import store from "../reduxStore"
import {
    setAddresses,
    setAddressesLoading,
    setAddressesError,
} from "../reduxReducers/addressReducers"

const { dispatch } = store

// ── Fetch all addresses for the logged-in user ──
export const fetchUserAddresses = async () => {
    dispatch(setAddressesLoading(true))
    dispatch(setAddressesError(null))

    try {
        const { data } = await axios.get(
            GET_MY_ADDRESSES_URL,
            { withCredentials: true }
        )
        dispatch(setAddresses(data.addresses))
        return data.addresses
    } catch (error) {
        dispatch(setAddressesError(
            error.response?.data?.message || "Failed to fetch addresses."
        ))
        throw error
    } finally {
        dispatch(setAddressesLoading(false))
    }
}

// ── Create a new address ──
// After a successful create, re-fetches the whole list rather than patching
// the array by hand. Reasoning: creating a new default address means the
// PREVIOUS default silently becomes non-default on the backend — a change
// this action never touched directly and has no way to know about without
// re-implementing that "unset all, then set one" rule here too. Re-fetching
// keeps this file free of business logic that already lives in the
// controller, and address lists are small, so the extra request is cheap.
export const createAddress = async (addressData) => {
    dispatch(setAddressesError(null))

    try {
        const { data } = await axios.post(
            ADD_ADDRESS_URL,
            addressData,
            { withCredentials: true }
        )
        await fetchUserAddresses()
        return data.address
    } catch (error) {
        dispatch(setAddressesError(
            error.response?.data?.message || "Failed to add address."
        ))
        throw error
    }
}

// ── Update an existing address ──
export const updateAddress = async (id, addressData) => {
    dispatch(setAddressesError(null))

    try {
        const { data } = await axios.put(
            UPDATE_ADDRESS_URL(id),
            addressData,
            { withCredentials: true }
        )
        await fetchUserAddresses()
        return data.address
    } catch (error) {
        dispatch(setAddressesError(
            error.response?.data?.message || "Failed to update address."
        ))
        throw error
    }
}

// ── Delete an address ──
// Refetching here isn't just "safe to do" — it's necessary. If the deleted
// address happened to be the default, the backend auto-promotes a different
// one to take its place, and the delete response doesn't tell us which
// address that was. Only a fresh fetch reveals the new state correctly.
export const deleteAddress = async (id) => {
    dispatch(setAddressesError(null))

    try {
        await axios.delete(
            DELETE_ADDRESS_URL(id),
            { withCredentials: true }
        )
        await fetchUserAddresses()
        return true
    } catch (error) {
        dispatch(setAddressesError(
            error.response?.data?.message || "Failed to delete address."
        ))
        throw error
    }
}

// ── Mark an address as the default ──
export const setDefaultAddress = async (id) => {
    dispatch(setAddressesError(null))

    try {
        const { data } = await axios.put(
            SET_DEFAULT_ADDRESS_URL(id),
            {},
            { withCredentials: true }
        )
        await fetchUserAddresses()
        return data.address
    } catch (error) {
        dispatch(setAddressesError(
            error.response?.data?.message || "Failed to set default address."
        ))
        throw error
    }
}