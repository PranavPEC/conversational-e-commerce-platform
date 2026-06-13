import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff,
  ShoppingBag, Tag, Truck, Shield, ArrowRight, Star, AlertCircle, X
} from 'lucide-react'
import { useDispatch } from "react-redux";
import { fetchUserData } from "../features/auth/authThunks.js";
import { SERVER_URL } from "../api/config.js";
function Login() {
  const dispatch=useDispatch();
  // ── Toast state ──
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setToastVisible(false)
    setTimeout(() => setToastVisible(true), 10)
    setTimeout(() => setToastVisible(false), 2600)
    setTimeout(() => setToast(null), 3000)
  }

  const dismissToast = () => {
    setToastVisible(false)
    setTimeout(() => setToast(null), 300)
  }

  // ── existing logic — untouched ──
  let navigate = useNavigate()
  let [email, setEmail] = React.useState("")
  let [password, setPassword] = React.useState("")

  // ── UI-only state ──
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      let { data } = await axios.post(SERVER_URL + "/login", {
        email,
        password
      }, {
        withCredentials: true
      })
      await dispatch(fetchUserData());
      navigate("/home");
    } catch (error) {
      if (error.response) {
        showToast(error.response.data.message)
      } else {
        showToast("Server not reachable.")
        console.log(error.message)
      }
    }
  }

  const features = [
    { icon: Tag,    title: "Exclusive offers",  desc: "Access special deals" },
    { icon: Truck,  title: "Fast delivery",      desc: "Quick & reliable shipping" },
    { icon: Shield, title: "Secure payments",    desc: "100% safe & secure" },
  ]

  return (
    <div className='w-full min-h-screen bg-zinc-950 flex'>

      {/* ── TOAST ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm transition-all duration-300 ${
            toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
        >
          <AlertCircle size={16} className='flex-shrink-0' />
          <p className='text-sm font-medium flex-1'>{toast}</p>
          <button
            onClick={dismissToast}
            className='hover:opacity-70 transition-opacity duration-150 flex-shrink-0'
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── LEFT PANEL ── */}
      <div
        className='hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10'
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1f1a 50%, #0a0f0a 100%)' }}
      >
        {/* Decorative blobs */}
        <div className='absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-10'
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className='absolute bottom-[100px] right-[-60px] w-[250px] h-[250px] rounded-full opacity-10'
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />

        {/* Logo */}
        <div className='flex items-center gap-2 z-10'>
          <div className='w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center'>
            <ShoppingBag size={18} className='text-zinc-950' />
          </div>
          <span className='text-white font-semibold text-lg tracking-tight'>ShopAI</span>
        </div>

        {/* Center content */}
        <div className='z-10 flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <h1 className='text-white text-5xl font-bold leading-tight tracking-tight'>
              Welcome<br />back
            </h1>
            <h2 className='text-emerald-400 text-4xl font-bold leading-tight'>
              good to see you
            </h2>
            <div className='w-16 h-1 bg-emerald-500 rounded-full' />
            <p className='text-zinc-400 text-sm leading-relaxed max-w-xs'>
              Log back in to ShopAI and pick up right where you left off. Your cart is waiting.
            </p>
          </div>

          {/* Feature list */}
          <div className='flex flex-col gap-4'>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full border border-emerald-500 flex items-center justify-center flex-shrink-0'>
                  <Icon size={16} className='text-emerald-400' />
                </div>
                <div>
                  <p className='text-white text-sm font-medium'>{title}</p>
                  <p className='text-zinc-500 text-xs'>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className='z-10 bg-zinc-900 bg-opacity-60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4'>
          <div className='flex -space-x-2'>
            {[1,2,3,4].map(i => (
              <div key={i} className='w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs text-white font-medium'>
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className='w-8 h-8 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-950 font-bold'>
              +2K
            </div>
          </div>
          <div>
            <p className='text-white text-sm font-medium'>Join 2K+ happy customers</p>
            <div className='flex items-center gap-0.5 mt-0.5'>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className='text-emerald-400 fill-emerald-400' />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className='w-full lg:w-[55%] bg-zinc-950 lg:bg-zinc-900 flex flex-col justify-center px-8 md:px-16 py-10'>

        {/* New here */}
        <div className='flex justify-end mb-6'>
          <p className='text-zinc-400 text-sm'>
            New here?{' '}
            <span
              onClick={() => navigate('/signup')}
              className='text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 font-medium'
            >
              Create an account
            </span>
          </p>
        </div>

        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <div className='w-14 h-14 rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0'>
            <Lock size={22} className='text-emerald-400' />
          </div>
          <div>
            <h1 className='text-white text-2xl font-bold tracking-tight'>Log In</h1>
            <p className='text-zinc-400 text-sm'>Welcome back, enter your details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className='flex flex-col gap-5'>

          {/* Email */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-zinc-300 text-sm font-medium'>Email</label>
            <div className='relative'>
              <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' />
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 text-sm transition-colors duration-200'
              />
            </div>
          </div>

          {/* Password */}
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <label className='text-zinc-300 text-sm font-medium'>Password</label>
              <span className='text-emerald-400 text-xs hover:text-emerald-300 cursor-pointer transition-colors duration-200'>
                Forgot password?
              </span>
            </div>
            <div className='relative'>
              <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-12 text-sm transition-colors duration-200'
              />
              <button
                type='button'
                onClick={() => setShowPassword(p => !p)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200'
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type='submit'
            className='w-full h-12 mt-1  bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
          >
            Log In
            <ArrowRight size={16} />
          </button>

        </form>

        {/* Divider */}
        <div className='flex items-center gap-3 my-5'>
          <div className='flex-1 h-px bg-zinc-800' />
          <span className='text-zinc-500 text-xs'>or continue with</span>
          <div className='flex-1 h-px bg-zinc-800' />
        </div>

        {/* Social buttons — UI only */}
        <div className='flex gap-3'>
          <button type='button' className='flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer'>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button type='button' className='flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </button>
          <button type='button' className='flex-1 h-11 bg-blue-600 hover:bg-blue-500 border border-blue-600 rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>

        {/* Terms */}
        <p className='text-zinc-500 text-xs text-center mt-5'>
          By logging in, you agree to our{' '}
          <span className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>Terms of Service</span>
          {' '}and{' '}
          <span className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>Privacy Policy</span>
        </p>

      </div>
    </div>
  )
}

export default Login
