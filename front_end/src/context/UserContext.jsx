import React, { createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { clearUserData } from "../features/auth/authSlice.js";
import { clearCart } from "../features/cart/cartSlice.js";

export const dataContext = createContext();

function UserContext({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const serverUrl = "http://localhost:8000";

  const logout = async () => {
    try {
      await axios.post(
        serverUrl + "/logout",
        {},
        { withCredentials: true }
      );

      dispatch(clearUserData());
      dispatch(clearCart());

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <dataContext.Provider value={{ logout }}>
      {children}
    </dataContext.Provider>
  );
}

export default UserContext;