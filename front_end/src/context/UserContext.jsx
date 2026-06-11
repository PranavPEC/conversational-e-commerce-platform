import React from 'react'
import axios from 'axios';
import { createContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const dataContext=createContext(); 
function UserContext({children}) {
  const navigate=useNavigate();
  const serverUrl="http://localhost:8000"
  let [userData,setUserData]=React.useState(null);
  let [authLoading,setAuthLoading]=React.useState(true);
  let [cartCount,setCartCount]=React.useState(0);

  const getUserData=async()=>{
    try{
      let {data}=await axios.get(serverUrl+"/getuserdata",{withCredentials:true});
      setUserData(data);
      await fetchCartCount();
    }
    catch(error){
      navigate("/login"); 
      console.log(error);
    }
    finally{
      setAuthLoading(false);
    }
  }

  const fetchCartCount=async()=>{
    try{
      let {data}=await axios.get(serverUrl+"/cart/",{withCredentials:true});
      const count=data.products?.reduce((sum,item)=>sum+item.quantity,0)||0;
      setCartCount(count);
    }
    catch(error){
      setCartCount(0);
    }
  }

  // Returns the full cart products array for the Cart page
  const getCart=async()=>{
    try{
      let {data}=await axios.get(serverUrl+"/cart/",{withCredentials:true});
      return data.products||[];
    }
    catch(error){
      return [];
    }
  }

  const addToCart=async(productId,quantity)=>{
    try{
      let {data}=await axios.post(
        serverUrl+"/cart/add",
        {productId,quantity},
        {withCredentials:true}
      );
      await fetchCartCount();
      return {success:true,msg:data.message};
    }
    catch(error){
      return {
        success:false,
        msg:error.response?.data?.message||"Failed to add to cart."
      };
    }
  }

  const updateCartItem=async(productId,quantity)=>{
    try{
      await axios.put(
        serverUrl+"/cart/update",
        {productId,quantity},
        {withCredentials:true}
      );
      await fetchCartCount();
      return {success:true};
    }
    catch(error){
      return {
        success:false,
        msg:error.response?.data?.message||"Failed to update cart."
      };
    }
  }

  const removeFromCart=async(productId)=>{
    try{
      await axios.delete(
        serverUrl+"/cart/remove/"+productId,
        {withCredentials:true}
      );
      await fetchCartCount();
      return {success:true};
    }
    catch(error){
      return {
        success:false,
        msg:error.response?.data?.message||"Failed to remove item."
      };
    }
  }

  const clearCart=async()=>{
    try{
      await axios.delete(serverUrl+"/cart/clear",{withCredentials:true});
      setCartCount(0);
      return {success:true};
    }
    catch(error){
      return {
        success:false,
        msg:error.response?.data?.message||"Failed to clear cart."
      };
    }
  }

  const logout=async()=>{
    try{
      await axios.post(serverUrl+"/logout",{},{withCredentials:true});
      setUserData(null);
      setCartCount(0);
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

  const value={
    serverUrl,
    userData,
    setUserData,
    getUserData,
    getAllProducts,
    getProductById,
    authLoading,
    cartCount,
    setCartCount,
    fetchCartCount,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    logout
  }

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
