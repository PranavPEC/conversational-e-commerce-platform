import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../api/config.js";
const serverUrl = "http://localhost:8000";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        serverUrl + "/cart/",
        { withCredentials: true }
      );

      return data.products || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch cart"
      );
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(
        serverUrl + "/cart/update",
        { productId, quantity },
        { withCredentials: true }
      );

      dispatch(fetchCart());

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update cart"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(
        serverUrl + "/cart/remove/" + productId,
        { withCredentials: true }
      );

      dispatch(fetchCart());

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to remove item"
      );
    }
  }
);

export const clearEntireCart = createAsyncThunk(
  "cart/clearEntireCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(
        serverUrl + "/cart/clear",
        { withCredentials: true }
      );

      dispatch(fetchCart());

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to clear cart"
      );
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        serverUrl + "/cart/add",
        { productId, quantity },
        { withCredentials: true }
      );

      await dispatch(fetchCart());

      return data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to add to cart."
      );
    }
  }
);
