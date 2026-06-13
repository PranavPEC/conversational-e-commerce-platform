import { createSlice } from "@reduxjs/toolkit";

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
});

export const {
  setUserData,
  clearUserData,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;