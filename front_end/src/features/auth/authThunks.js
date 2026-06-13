// src/features/auth/authThunks.js
import { SERVER_URL } from "../../api/config.js";
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

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        serverUrl + "/logout",
        {},
        { withCredentials: true }
      );

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);