// src/redux/reduxActions/authActions.js

import axios from "axios";
import { GET_USER_DATA_URL, LOGIN_URL, LOGOUT_URL, SIGNUP_URL, FORGOT_PASSWORD_URL, VERIFY_OTP_URL, RESET_PASSWORD_URL, UPDATE_USER_URL } from "../../config/urls";
import { buildFormData } from "../../utils/CommonFunctions.js";
import store from "../reduxStore";

import {
  setUserData,
  clearUserData,
  setAuthLoading,
} from "../reduxReducers/authReducers";

const { dispatch } = store;

export const fetchUserData = async () => {
  dispatch(setAuthLoading(true));

  try {
    const { data } = await axios.get(
      GET_USER_DATA_URL,
      {
        withCredentials: true,
      }
    );

    dispatch(setUserData(data.data.user));

    return data.data.user;
  } catch (error) {
    dispatch(clearUserData());
    throw error;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

export const logoutUser = async () => {
  dispatch(setAuthLoading(true));

  try {
    await axios.post(
      LOGOUT_URL,
      {},
      {
        withCredentials: true,
      }
    );

    dispatch(clearUserData());

    return true;
  }
  finally {
    dispatch(setAuthLoading(false));
  }
};

export const loginUser = async ({ email, password }) => {
  await axios.post(
    LOGIN_URL,
    { email, password },
    {
      withCredentials: true,
    }
  );
  await fetchUserData()
  return true;
};

export const signupUser = async (formData) => {
  await axios.post(
    SIGNUP_URL,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return true;
};
// ── Forgot Password ──
export const forgotPassword = async ({ email }) => {
  const { data } = await axios.post(
    FORGOT_PASSWORD_URL,
    { email },
    {
      withCredentials: true,
    }
  );
  return data;
};

// ── Verify OTP ──
export const verifyOTP = async ({ email, otp }) => {
  const { data } = await axios.post(
    VERIFY_OTP_URL,
    { email, otp },
    {
      withCredentials: true,
    }
  );

  return {
    message: data.message,
    resetToken: data.data?.resetToken,
  };
};

// ── Update Profile ──
export const updateUserProfile = async ({ id, name, email, phone, dateOfBirth, gender, profileImageFile }) => {

  // Always builds multipart/form-data now (via buildFormData) instead of
  // JSON — this one request can carry text fields alone, an avatar alone,
  // or both together. Your controller already handles this: it only
  // touches profileImage when req.file is actually present, and Mongoose
  // ignores undefined fields, so partial updates stay safe either way.
  const formData = buildFormData(
    { name, email, phone, dateOfBirth, gender },
    profileImageFile,
    'profileImage'
  );

  const { data } = await axios.put(
    UPDATE_USER_URL(id),
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );

  // Backend returns the full updated user (minus password) —
  // push it straight into Redux so Navbar, Profile, everywhere stays in sync.
  dispatch(setUserData(data.data.user));

  return data.data.user;

};

// ── Reset Password ──
export const resetPassword = async ({
  resetToken,
  newPassword,
}) => {
  const { data } = await axios.post(
    RESET_PASSWORD_URL,
    {
      resetToken,
      newPassword,
    },
    {
      withCredentials: true,
    }
  );

  return data;

};