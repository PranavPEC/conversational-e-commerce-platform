import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { fetchUserData, signupUser } from '../../redux/reduxActions/authActions.js'
import useToast from '../../utils/useToast.js'

// ── Validations ──
import {
    checkIsEmpty,
    isValidEmail,
    checkPasswordValidations,
    checkPasswordMatch,
    checkNameValidation,
} from '../../utils/validations.js'

// ── Common components ──
import Toast from '../../components/common_components/Toast.jsx'
import SocialButtons from '../../components/common_components/SocialButtons.jsx'
import BrandLogo from '../../components/common_components/BrandLogo.jsx'
import AvatarPicker from '../../components/common_components/AvatarPicker.jsx'

// ── SignUp-specific components ──
import SignUpLeftPanel from './SignUpLeftPanel.jsx'
import SignUpForm from './SignUpForm.jsx'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'


function SignUp() {
    const navigate = useNavigate()
    const { t } = useTranslation(['auth', 'errors'])

    // ── Toast ──
    const { toast, toastVisible, showToast, dismissToast } = useToast()

    // ── Form state ──
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false);

    // ── Avatar state ──
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)

    // ── Avatar picker callback ──
    const handleImageChange = (file, previewUrl) => {
        setBackendImage(file)
        setFrontendImage(previewUrl)
    }

    // ── Validations — same pattern as inspiration project's _checkValidations ──
    // Each validator shows its own error and returns false
    // We just check the return value and return early
    const _checkValidations = () => {
        if (!checkNameValidation(name, showToast,t)) return false
        if (checkIsEmpty(email)) { showToast(t('email_required')); return false }
        if (!isValidEmail(email)) { showToast(t('email_invalid')); return false }
        if (!checkPasswordValidations(password, showToast,t)) return false
        if (!checkPasswordMatch(password, confirmPassword, showToast, t)) return false
        return true
    }

    // ── Submit handler ──
    const handleSignUp = async (e) => {
        e.preventDefault()

        // Run all validations first — stop if any fail
        if (!_checkValidations()) return

        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            if (backendImage) {
                formData.append('profileImage', backendImage)
            }
            setLoading(true);
            try {
                await signupUser(formData);
                await fetchUserData()
                navigate(navigationStrings.HOME)
            }
            catch (error) {
                if (error.response) {
                    showToast(error.response.data.message)
                } else {
                    showToast(t('server_not_reachable'))
                }
            }
            finally {
                setLoading(false);
            }


            // fetchUserData dispatches internally — no dispatch() needed here

        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message)
            } else {
                showToast(t('server_not_reachable'))
            }
        }
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] flex'>

            <Toast
                toast={toast}
                toastVisible={toastVisible}
                dismissToast={dismissToast}
            />

            <SignUpLeftPanel />

            <div className='w-full lg:w-[55%] bg-[var(--color-bg)] lg:bg-[var(--color-card)] flex flex-col justify-center px-8 md:px-16 py-10 overflow-y-auto'>

                <BrandLogo />

                <div className='flex justify-end mb-6'>
                    <p className='text-zinc-400 text-sm'>
                        {t('already_have_account')}{' '}
                        <span
                            onClick={() => navigate(navigationStrings.LOGIN)}
                            className='text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 font-medium'
                        >
                            {t('login_link')}
                        </span>
                    </p>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <AvatarPicker
                        frontendImage={frontendImage}
                        onImageChange={handleImageChange}
                    />
                    <div>
                        <h1 className='text-white text-2xl font-bold tracking-tight'>{t('sign_up')}</h1>
                        <p className='text-zinc-400 text-sm'>
                            {frontendImage
                                ? t('signup_subheading_filled')
                                : t('signup_subheading_empty')
                            }
                        </p>
                    </div>
                </div>

                <SignUpForm
                    name={name} setName={setName}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                    showPassword={showPassword} setShowPassword={setShowPassword}
                    showConfirm={showConfirm} setShowConfirm={setShowConfirm}
                    handleSignUp={handleSignUp}
                    loading={loading}
                />

                <SocialButtons />

                <p className='text-zinc-500 text-xs text-center mt-5'>
                    <Trans i18nKey='signup_terms_agreement' ns='auth'>
                        By signing up, you agree to our <span className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>Terms of Service</span> and <span className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>Privacy Policy</span>
                    </Trans>
                </p>

            </div>
        </div>
    )
}

export default SignUp