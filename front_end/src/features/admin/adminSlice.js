import { createSlice } from "@reduxjs/toolkit";
import { createProduct, updateProduct, deleteProduct } from "./adminThunks.js";

// Admin slice manages the product list for the dashboard
// It is separate from productsSlice (which is for the public product listing)
// Reason: admin needs full CRUD state (loading per operation, errors per operation)
// while the public listing just needs read state
const initialState = {
    products: [],       // full product list shown in admin table — populated from productSlice via Admin.jsx
    loading: false,     // true during create / update / delete
    error: null,        // error from any admin operation
    success: null,      // success message — used to show toast after an operation
};

const adminSlice = createSlice({
    name: "admin",
    initialState,

    reducers: {
        // Call after showing success/error toast so it doesn't persist across actions
        clearAdminStatus: (state) => {
            state.error = null;
            state.success = null;
        },

        // Admin.jsx sets the product list from the existing productsSlice
        // so we don't make a duplicate API call — we just copy the data over
        setAdminProducts: (state, action) => {
            state.products = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder

            // ── Create Product ──
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.unshift(action.payload);     // add new product to top of list
                state.success = "Product created successfully.";
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Update Product ──
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                // Find and replace the updated product in the array
                const idx = state.products.findIndex(p => p._id === action.payload._id);
                if (idx !== -1) state.products[idx] = action.payload;
                state.success = "Product updated successfully.";
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Delete Product ──
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is the deleted product's id (returned from thunk)
                state.products = state.products.filter(p => p._id !== action.payload);
                state.success = "Product deleted successfully.";
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdminStatus, setAdminProducts } = adminSlice.actions;
export default adminSlice.reducer;