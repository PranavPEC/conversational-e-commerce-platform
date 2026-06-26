import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import cartReducer from "../features/cart/cartSlice.js";
import productsReducer from "../features/products/productSlice.js";
import orderReducer from "../features/order/orderSlice.js";    // Step 12 & 13
import adminReducer from "../features/admin/adminSlice.js";    // Step 14

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});