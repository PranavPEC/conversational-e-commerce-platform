// src/utils/urls.js
// All API endpoint URLs in one place
// Pattern from inspiration project's config/urls.ts
//
// Benefits:
// - Change the base URL once → everything updates
// - No hardcoded strings scattered across action files
// - Easy to see all endpoints at a glance
// - If backend renames a route, you fix it in one place

import { SERVER_URL } from "../utils/APIConfig.js"

// ── Auth ──
export const LOGIN_URL              = SERVER_URL + "/login"
export const SIGNUP_URL             = SERVER_URL + "/signup"
export const GET_USER_DATA_URL      = SERVER_URL + "/getuserdata"
export const LOGOUT_URL             = SERVER_URL + "/logout"

// ── Products ──
export const GET_ALL_PRODUCTS_URL   = SERVER_URL + "/product/all"
export const GET_PRODUCT_BY_ID_URL  = (id) => SERVER_URL + "/product/" + id

// ── Cart ──
export const GET_CART_URL           = SERVER_URL + "/cart/"
export const ADD_TO_CART_URL        = SERVER_URL + "/cart/add"
export const UPDATE_CART_URL        = SERVER_URL + "/cart/update"
export const REMOVE_CART_ITEM_URL   = (id) => SERVER_URL + "/cart/remove/" + id
export const CLEAR_CART_URL         = SERVER_URL + "/cart/clear"

// ── Orders ──
export const GET_MY_ORDERS_URL      = SERVER_URL + "/order/myorders"
export const CANCEL_ORDER_URL       = (id) => SERVER_URL + "/order/cancel/" + id

// ── Payment ──
export const CREATE_RAZORPAY_ORDER_URL  = SERVER_URL + "/payment/create-order"
export const VERIFY_PAYMENT_URL         = SERVER_URL + "/payment/verify"

// ── Admin / Products CRUD ──
export const CREATE_PRODUCT_URL     = SERVER_URL + "/product/create"
export const UPDATE_PRODUCT_URL     = (id) => SERVER_URL + "/product/update/" + id
export const DELETE_PRODUCT_URL     = (id) => SERVER_URL + "/product/delete/" + id