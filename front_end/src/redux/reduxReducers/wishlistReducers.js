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
        updateWishlistItemStock: (state, action) => {
    const { productId, stock } = action.payload
    const item = state.wishlist.find(i => i.product?._id === productId)
    if (item) item.product.stock = stock
},
    },
})

export const { setWishlist, setWishlistLoading, setWishlistError, updateWishlistItemStock } = wishlistSlice.actions
export default wishlistSlice.reducer