import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCart,
    updateCart,
    removeCartItem,
    clearEntireCart,
    addCartItem
} from "./cartThunks.js";

const initialState = {
    cartCount: 0,
    cartItems: [],
    cartLoading: false,   // only true on first mount fetch — never during +/-
    itemLoading: {},      // { [productId]: true } — per item during +/-
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        setCartCount: (state, action) => {
            state.cartCount = action.payload;
        },
        clearCartCount: (state) => {
            state.cartCount = 0;
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        setCartError: (state, action) => {
            state.error = action.payload;
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.cartCount = 0;
            state.itemLoading = {};
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ── fetchCart ──
            // pending: only set cartLoading when silent is false (initial mount)
            // fulfilled: always update cartItems regardless of silent flag
            .addCase(fetchCart.pending, (state, action) => {
                const silent = action.meta.arg?.silent ?? false;
                if (!silent) {
                    state.cartLoading = true;
                }
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cartLoading = false;
                state.cartItems = action.payload.products;
                state.cartCount = action.payload.products.reduce(
                    (sum, item) => sum + item.quantity, 0
                );
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.cartLoading = false;
                state.error = action.payload;
            })

            // ── updateCart — per-item loading ──
            .addCase(updateCart.pending, (state, action) => {
                state.itemLoading[action.meta.arg.productId] = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.itemLoading[action.payload] = false;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.itemLoading[action.meta.arg.productId] = false;
                state.error = action.payload;
            })

            // ── removeCartItem — per-item loading ──
            .addCase(removeCartItem.pending, (state, action) => {
                state.itemLoading[action.meta.arg] = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.itemLoading[action.payload] = false;
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.itemLoading[action.meta.arg] = false;
                state.error = action.payload;
            })

            .addCase(addCartItem.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(clearEntireCart.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const {
    setCartCount,
    clearCartCount,
    setCartItems,
    setCartError,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;