import { createSlice } from "@reduxjs/toolkit";
import { fetchCart } from "./cartThunks.js";
const initialState = {
  cartCount: 0,
  cartItems: [],
  loading: false,
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

    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCartError: (state, action) => {
      state.error = action.payload;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
  state.loading = false;
  state.cartItems = action.payload;

  state.cartCount = action.payload.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
})

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCartCount,
  clearCartCount,
  setCartItems,
  setCartLoading,
  setCartError,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;