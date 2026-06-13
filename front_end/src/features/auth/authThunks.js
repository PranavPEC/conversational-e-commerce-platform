// src/features/auth/authThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl = "http://localhost:8000";

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        serverUrl + "/getuserdata",
        { withCredentials: true }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);