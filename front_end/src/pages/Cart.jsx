import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCart,
  removeCartItem,
  clearEntireCart,
} from "../features/cart/cartThunks.js";

function Cart() {
  
  const navigate = useNavigate()

 const dispatch = useDispatch();

const {
  cartItems,
  loading,
  error,
} = useSelector((state) => state.cart);
console.log("Cart Redux State", {
  cartItems,
  loading,
  error,
});

  // Fetch cart on mount
useEffect(() => {
  dispatch(fetchCart());
}, [dispatch]);

  // Increase or decrease quantity
  const handleQuantityChange = async (productId, currentQty, change) => {
    const newQty = currentQty + change

    // If new quantity is 0, remove the item instead
    if (newQty < 1) {
      await handleRemove(productId)
      return
    }

    const result = await dispatch(
  updateCart({
    productId,
    quantity: newQty,
  })
);

if (updateCart.fulfilled.match(result)) {
  // success
} else {
      setError(result.msg)
      setTimeout(() => setError(null), 3000)
    }
  }

 const handleRemove = async (productId) => {
  const result = await dispatch(
    removeCartItem(productId)
  );

  if (removeCartItem.fulfilled.match(result)) {
    // success
  }
};

  const handleClearCart = async () => {
  const result = await dispatch(
    clearEntireCart()
  );

  if (clearEntireCart.fulfilled.match(result)) {
    // success
  }
};

  // Calculate total price
  const total = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  // ── Loading ──
  if (loading) {
    return (
      <div className='w-full min-h-screen bg-zinc-950 flex justify-center items-center'>
        <p className='text-zinc-400 text-sm'>Loading cart...</p>
      </div>
    )
  }

  // ── Empty Cart ──
  if (cartItems.length === 0) {
    return (
      <div className='w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center gap-4'>
        <p className='text-white text-lg font-medium'>Your cart is empty</p>
        <p className='text-zinc-400 text-sm'>Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate('/products')}
          className='mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200'
        >
          Browse Products
        </button>
      </div>
    )
  }

  // ── Cart with Items ──
  return (
    <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>

      {/* Header */}
      <div className='max-w-3xl mx-auto flex items-center justify-between mb-8'>
        <h1 className='text-white text-2xl font-semibold tracking-tight'>
          Your Cart
          <span className='text-zinc-500 text-base font-normal ml-2'>({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
        </h1>
        <button
          onClick={handleClearCart}
          className='text-sm text-zinc-500 hover:text-red-400 transition-colors duration-200'
        >
          Clear cart
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className='max-w-3xl mx-auto mb-4'>
          <p className='text-red-400 text-sm'>{error}</p>
        </div>
      )}

      <div className='max-w-3xl mx-auto flex flex-col gap-4'>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div
            key={item.product._id}
            className='bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-center'
          >
            {/* Product Image */}
            <div
              onClick={() => navigate('/product/' + item.product._id)}
              className='w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 cursor-pointer'
            >
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-zinc-600 text-xs'>
                  No img
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className='flex-1 flex flex-col gap-1'>
              <h2
                onClick={() => navigate('/product/' + item.product._id)}
                className='text-white text-sm font-medium cursor-pointer hover:text-emerald-400 transition-colors duration-200'
              >
                {item.product.title}
              </h2>
              <p className='text-emerald-400 text-sm font-semibold'>₹{item.product.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className='flex items-center gap-3'>
              <button
                onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center'
              >
                −
              </button>
              <span className='text-white font-medium w-5 text-center text-sm'>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.product._id, item.quantity, +1)}
                className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center'
              >
                +
              </button>
            </div>

            {/* Item Subtotal */}
            <div className='w-24 text-right'>
              <p className='text-white text-sm font-semibold'>₹{item.product.price * item.quantity}</p>
            </div>

            {/* Remove */}
            <button
              onClick={() => handleRemove(item.product._id)}
              className='text-zinc-600 hover:text-red-400 transition-colors duration-200 text-lg ml-2'
            >
              ✕
            </button>

          </div>
        ))}

        {/* Order Summary */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-4 flex flex-col gap-4'>

          <div className='flex justify-between items-center'>
            <span className='text-zinc-400 text-sm'>Subtotal</span>
            <span className='text-white text-sm'>₹{total}</span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-zinc-400 text-sm'>Shipping</span>
            <span className='text-emerald-400 text-sm'>Free</span>
          </div>

          <div className='h-px bg-zinc-800' />

          <div className='flex justify-between items-center'>
            <span className='text-white font-semibold'>Total</span>
            <span className='text-emerald-400 text-xl font-bold'>₹{total}</span>
          </div>

          {/* Checkout — wired in Phase 5 */}
          <button className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 mt-2'>
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate('/products')}
            className='w-full text-center text-zinc-400 hover:text-white text-sm transition-colors duration-200'
          >
            ← Continue Shopping
          </button>

        </div>
      </div>
    </div>
  )
}

export default Cart
