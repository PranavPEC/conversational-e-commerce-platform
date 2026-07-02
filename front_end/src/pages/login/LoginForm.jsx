import React from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

// Props:
//   email, setEmail           — email field state
//   password, setPassword     — password field state
//   showPassword,             — toggle password visibility
//   setShowPassword
//   handleLogin               — form submit handler (defined in Login.jsx)

function LoginForm({
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    handleLogin,
    loading
}) {
    return (
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
                disabled={loading}
                className='w-full h-12 mt-1 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
            >
                {loading ? 'Logging in...' : 'Log In'}
                <ArrowRight size={16} />
            </button>

        </form>
    )
}

export default LoginForm
