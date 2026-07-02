import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { fetchUserData } from '../../redux/reduxActions/authActions.js'
import { SERVER_URL } from '../../utils/APIConfig.js'
import useToast from '../../utils/useToast.js'

// ── Validations ──
import { checkIsEmpty, isValidEmail } from '../../utils/validations.js'

// ── Child components ──
import Toast from '../../components/common_components/Toast.jsx'
import LoginLeftPanel from './LoginLeftPanel.jsx'
import LoginForm from './LoginForm.jsx'
import SocialButtons from '../../components/common_components/SocialButtons.jsx'

function Login() {
    const navigate = useNavigate()

    const { toast, toastVisible, showToast, dismissToast } = useToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // ── Validations ──
    const _checkValidations = () => {
        if (checkIsEmpty(email)) { showToast("Please enter your email."); return false }
        if (!isValidEmail(email)) { showToast("Please enter a valid email address."); return false }
        if (checkIsEmpty(password)) { showToast("Please enter your password."); return false }
        return true
    }

    // ── Submit handler ──
    const handleLogin = async (e) => {
        e.preventDefault()

        if (!_checkValidations()) return

        try {
            await axios.post(
                SERVER_URL + '/login',
                { email, password },
                { withCredentials: true }
            )
            await fetchUserData()
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

            <Toast
                toast={toast}
                toastVisible={toastVisible}
                dismissToast={dismissToast}
            />

            <LoginLeftPanel />

            <div className='w-full lg:w-[55%] bg-zinc-950 lg:bg-zinc-900 flex flex-col justify-center px-8 md:px-16 py-10'>

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

                <div className='flex items-center gap-4 mb-8'>
                    <div className='w-14 h-14 rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0'>
                        <Lock size={22} className='text-emerald-400' />
                    </div>
                    <div>
                        <h1 className='text-white text-2xl font-bold tracking-tight'>Log In</h1>
                        <p className='text-zinc-400 text-sm'>Welcome back, enter your details</p>
                    </div>
                </div>

                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleLogin={handleLogin}
                />

                <SocialButtons />

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