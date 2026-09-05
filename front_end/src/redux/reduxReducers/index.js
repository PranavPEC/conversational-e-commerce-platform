// src/redux/reduxReducers/index.js
// All features migrated — features/ folder can now be deleted

import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "./authReducers"
import productReducer from "./productReducers"
import cartReducer from "./cartReducers"
import orderReducer from "./orderReducers"
import sellerReducer from "./sellerReducers"
import adminReducer from "./adminReducers"
import addressReducer from "./addressReducers"
import themeReducer from "./themeReducers"
import wishlistReducer from "./wishlistReducers"

const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
    seller: sellerReducer,
    admin: adminReducer,
    address: addressReducer,
    theme: themeReducer,
    wishlist: wishlistReducer,
})

export default rootReducer