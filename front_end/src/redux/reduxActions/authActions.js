// src/redux/reduxActions/authActions.js

import axios from "axios";
import { SERVER_URL } from "../../utils/APIConfig";

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
      SERVER_URL + "/getuserdata",
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
      SERVER_URL + "/logout",
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