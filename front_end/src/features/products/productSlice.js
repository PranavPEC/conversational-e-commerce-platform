import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductById,
} from "./productThunks.js";

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
  builder

    .addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    })

    .addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    })

    .addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
},
});

export const {
  clearSelectedProduct,
} = productsSlice.actions;

export default productsSlice.reducer;