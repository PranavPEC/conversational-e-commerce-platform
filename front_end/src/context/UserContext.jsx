import React from 'react'
import axios from 'axios';
import { createContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { fetchCart } from '../features/cart/cartThunks.js';
import {
  setUserData as setReduxUserData,
  clearUserData,
  setAuthLoading as setReduxAuthLoading,
} from "../features/auth/authSlice.js";

import { clearCart } from "../features/cart/cartSlice.js";


export const dataContext=createContext(); 
function UserContext({children}) {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const serverUrl="http://localhost:8000"
  useEffect(() => {
  dispatch(setReduxAuthLoading(true));
}, []);
  

  const getUserData = async () => {
  try {
    let { data } = await axios.get(
      serverUrl + "/getuserdata",
      { withCredentials: true }
    );

    dispatch(setReduxUserData(data));

    await dispatch(fetchCart());
  } catch (e) {
    navigate("/login");
    console.log(e);
  } finally {
    dispatch(setReduxAuthLoading(false));
  }
};

  // Returns the full cart products array for the Cart page
  


  const logout=async()=>{
    try{
      await axios.post(serverUrl+"/logout",{},{withCredentials:true});
      dispatch(clearUserData());
      dispatch(clearCart());
      navigate("/login");
    }
    catch(error){
      console.log(error);
    }
  }

  const getProductById=async(id)=>{
    try{
      let {data}=await axios.get(serverUrl+"/product/"+id);
      return data.product;
    }
    catch(error){
      console.log(error);
    }
  }

  const getAllProducts=async()=>{
    try{
      let {data}=await axios.get(serverUrl+"/product/all");
      return data.products;
    }
    catch(error){
      console.log(error);
    }
  }

  const value = {
  serverUrl,
  getUserData,
  getAllProducts,
  getProductById,
  logout,
};

  useEffect(()=>{
    getUserData();
  },[]);

  return (
    <dataContext.Provider value={value}>
      {children}
    </dataContext.Provider>
  )
}

export default UserContext;
