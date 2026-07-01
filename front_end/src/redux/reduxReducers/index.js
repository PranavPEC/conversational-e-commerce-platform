// src/redux/reduxReducers/index.js
// All features migrated — features/ folder can now be deleted

import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "./authReducers"
import productReducer from "./productReducers"
import cartReducer from "./cartReducers"
import orderReducer from "./orderReducers"
import adminReducer from "./adminReducers"

const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
})

export default rootReducer