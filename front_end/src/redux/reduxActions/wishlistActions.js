import axios from "axios"
import { ADD_TO_WISHLIST_URL, GET_MY_WISHLIST_URL, REMOVE_FROM_WISHLIST_URL } from "../../config/urls"
import store from "../reduxStore"
import { setWishlist, setWishlistLoading, setWishlistError } from "../reduxReducers/wishlistReducers"

const { dispatch } = store

export const fetchUserWishlist = async () => {
    dispatch(setWishlistLoading(true))
    dispatch(setWishlistError(null))
    try {
        const { data } = await axios.get(GET_MY_WISHLIST_URL, { withCredentials: true })
        dispatch(setWishlist(data.data.wishlist))
        return data.data.wishlist
    } catch (error) {
        dispatch(setWishlistError(error.response?.data?.message || "Failed to fetch wishlist."))
        throw error
    } finally {
        dispatch(setWishlistLoading(false))
    }
}

// Not called by any button yet (that's next session) — included now
// because the page itself needs a complete backend to fetch against.
export const addToWishlist = async (productId) => {
    dispatch(setWishlistError(null))
    try {
        const { data } = await axios.post(ADD_TO_WISHLIST_URL, { productId }, { withCredentials: true })
        await fetchUserWishlist()
        return data.data.wishlistItem
    } catch (error) {
        dispatch(setWishlistError(error.response?.data?.message || "Failed to add to wishlist."))
        throw error
    }
}

export const removeFromWishlist = async (productId) => {
    dispatch(setWishlistError(null))
    try {
        await axios.delete(REMOVE_FROM_WISHLIST_URL(productId), { withCredentials: true })
        await fetchUserWishlist()
        return true
    } catch (error) {
        dispatch(setWishlistError(error.response?.data?.message || "Failed to remove from wishlist."))
        throw error
    }
}