import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../../features/auth/authThunks.js'
import { SERVER_URL } from '../../api/config.js'
import useToast from '../../utils/useToast.js'

// ── Child components ──
import Toast from './Toast.jsx'
import LoginLeftPanel from './LoginLeftPanel.jsx'
import LoginForm from './LoginForm.jsx'
import SocialButtons from './SocialButtons.jsx'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ── Toast ──
    const { toast, toastVisible, showToast, dismissToast } = useToast()

    // ── Form state ──
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // ── Submit handler ──
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                SERVER_URL + '/login',
                { email, password },
                { withCredentials: true }
            )
            await dispatch(fetchUserData())
            navigate('/home')
        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message)
            } else {
                showToast('Server not reachable.')
            }
        }
    }

    return (
        <div className='w-full min-h-screen bg-zinc-950 flex'>

            {/* Toast notification */}
            <Toast
                toast={toast}
                toastVisible={toastVisible}
                dismissToast={dismissToast}
            />

            {/* Left panel — logo, headline, features, social proof */}
            <LoginLeftPanel />

            {/* Right panel — form */}
            <div className='w-full lg:w-[55%] bg-zinc-950 lg:bg-zinc-900 flex flex-col justify-center px-8 md:px-16 py-10'>

                {/* Switch to signup */}
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

                {/* Form — email, password, submit */}
                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleLogin={handleLogin}
                />

                {/* Divider + Google, Apple, Facebook buttons */}
                <SocialButtons />

                {/* Terms */}
                <p className='text-zinc-500 text-xs text-center mt-5'>
                    By logging in, you agree to our{' '}
                    <span className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>
                        Terms of Service
                    </span>
                    {' '}and{' '}
                    <span className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>
                        Privacy Policy
                    </span>
                </p>

            </div>
        </div>
    )
}

export default Login
