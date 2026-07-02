// src/redux/reduxActions/authActions.js

import axios from "axios";
import { SERVER_URL } from "../../utils/APIConfig";
import { GET_USER_DATA_URL,LOGIN_URL,LOGOUT_URL, SIGNUP_URL } from "../../config/urls";
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

export const loginUser = async ({email,password}) => {
  try {
    await axios.post(
      LOGIN_URL,
      {email,password},
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    throw error;
  } finally {
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
  } finally {
  }
};