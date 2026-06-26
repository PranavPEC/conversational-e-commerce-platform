import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../../features/auth/authThunks.js'
import { SERVER_URL } from '../../utils/APIConfig.js'
import useToast from '../../utils/useToast.js'

// ── Common components ──
import Toast from '../../components/common_components/Toast.jsx'
import SocialButtons from '../../components/common_components/SocialButtons.jsx'

// ── SignUp-specific components ──
import SignUpLeftPanel from './SignUpLeftPanel.jsx'
import SignUpForm from './SignUpForm.jsx'
import AvatarPicker from './AvatarPicker.jsx'

function SignUp() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ── Toast ──
    const { toast, toastVisible, showToast, dismissToast } = useToast()

    // ── Form state ──
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // ── Avatar state ──
    const [frontendImage, setFrontendImage] = useState(null)  // blob URL for preview
    const [backendImage, setBackendImage] = useState(null)    // actual File object

    // ── Avatar picker callback ──
    // AvatarPicker calls this with (file, previewUrl) when user picks an image
    const handleImageChange = (file, previewUrl) => {
        setBackendImage(file)
        setFrontendImage(previewUrl)
    }

    // ── Submit handler ──
    const handleSignUp = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            showToast('Passwords do not match.')
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            if (backendImage) {
                formData.append('profileImage', backendImage)
            }

            await axios.post(SERVER_URL + '/signup', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })

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

            {/* Toast notification — shared with Login */}
            <Toast
                toast={toast}
                toastVisible={toastVisible}
                dismissToast={dismissToast}
            />

            {/* Left panel — signup-specific headline */}
            <SignUpLeftPanel />

            {/* Right panel */}
            <div className='w-full lg:w-[55%] bg-zinc-950 lg:bg-zinc-900 flex flex-col justify-center px-8 md:px-16 py-10 overflow-y-auto'>

                {/* Switch to login */}
                <div className='flex justify-end mb-6'>
                    <p className='text-zinc-400 text-sm'>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className='text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 font-medium'
                        >
                            Login
                        </span>
                    </p>
                </div>

                {/* Header — avatar picker + title */}
                <div className='flex items-center gap-4 mb-8'>
                    <AvatarPicker
                        frontendImage={frontendImage}
                        onImageChange={handleImageChange}
                    />
                    <div>
                        <h1 className='text-white text-2xl font-bold tracking-tight'>Sign Up</h1>
                        <p className='text-zinc-400 text-sm'>
                            {frontendImage
                                ? 'Looking good! Fill in your details'
                                : 'Create your account to get started'
                            }
                        </p>
                    </div>
                </div>

                {/* Form — name, email, password, confirm, submit */}
                <SignUpForm
                    name={name} setName={setName}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                    showPassword={showPassword} setShowPassword={setShowPassword}
                    showConfirm={showConfirm} setShowConfirm={setShowConfirm}
                    handleSignUp={handleSignUp}
                />

                {/* Divider + Google, Apple, Facebook — shared with Login */}
                <SocialButtons />

                {/* Terms */}
                <p className='text-zinc-500 text-xs text-center mt-5'>
                    By signing up, you agree to our{' '}
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

export default SignUp
