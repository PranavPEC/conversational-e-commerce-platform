// src/redux/reduxActions/authActions.js

import axios from "axios";
import { GET_USER_DATA_URL, LOGIN_URL, LOGOUT_URL, SIGNUP_URL,FORGOT_PASSWORD_URL,VERIFY_OTP_URL,RESET_PASSWORD_URL, UPDATE_USER_URL } from "../../config/urls";
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

    dispatch(setUserData(data));

    return data;
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
  } catch (error) {
    throw error;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    await axios.post(
      LOGIN_URL,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    throw error;
  }
};

export const signupUser = async (formData) => {
  try {
    await axios.post(
      SIGNUP_URL,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return true;
  } catch (error) {
    throw error;
  } 
};
// ── Forgot Password ──
export const forgotPassword = async ({ email }) => {
  try {
    const { data } = await axios.post(
      FORGOT_PASSWORD_URL,
      { email },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// ── Verify OTP ──
export const verifyOTP = async ({ email, otp }) => {
  try {
    const { data } = await axios.post(
      VERIFY_OTP_URL,
      { email, otp },
      {
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

// ── Update Profile ──
export const updateUserProfile = async ({ id, name, email, phone, dateOfBirth, gender, profileImageFile }) => {
  try {
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
    dispatch(setUserData(data));

    return data;
  } catch (error) {
    throw error;
  }
};

// ── Reset Password ──
export const resetPassword = async ({
  resetToken,
  newPassword,
}) => {
  try {
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
  } catch (error) {
    throw error;
  }
};