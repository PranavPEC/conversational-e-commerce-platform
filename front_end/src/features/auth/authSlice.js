import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData, logoutUser } from "./authThunks.js";

const initialState = {
  userData: null,
  authLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    clearUserData: (state) => {
      state.userData = null;
    },

    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.authLoading = true;
      })

      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.authLoading = false;
      })

      .addCase(fetchUserData.rejected, (state) => {
        state.userData = null;
        state.authLoading = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
        state.authLoading = false;
      });
  },
});

export const {
  setUserData,
  clearUserData,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;