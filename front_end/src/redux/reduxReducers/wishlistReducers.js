import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    wishlist: [],
    wishlistLoading: false,
    wishlistError: null,
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action) => {
            state.wishlist = action.payload
        },
        setWishlistLoading: (state, action) => {
            state.wishlistLoading = action.payload
        },
        setWishlistError: (state, action) => {
            state.wishlistError = action.payload
        },
    },
})

export const { setWishlist, setWishlistLoading, setWishlistError } = wishlistSlice.actions
export default wishlistSlice.reducer