import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../api/config.js";


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        SERVER_URL + "/product/all"
      );

      return data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        SERVER_URL + "/product/" + id
      );

      return data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch product"
      );
    }
  }
);