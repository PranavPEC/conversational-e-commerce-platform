import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { Lock } from 'lucide-react'
import { loginUser } from '../../redux/reduxActions/authActions.js'
import useToast from '../../utils/useToast.js'
import { googleLogin, facebookLogin } from '../../redux/reduxActions/authActions.js'
// (add googleLogin to your existing import from authActions)

// ── Validations ──
import { checkIsEmpty, isValidEmail } from '../../utils/validations.js'

// ── Child components ──
import Toast from '../../components/common_components/Toast.jsx'
import LoginLeftPanel from './LoginLeftPanel.jsx'
import LoginForm from './LoginForm.jsx'
import SocialButtons from '../../components/common_components/SocialButtons.jsx'
import BrandLogo from '../../components/common_components/BrandLogo.jsx'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function Login() {
    const navigate = useNavigate()
    const { t } = useTranslation(['auth', 'errors'])

    const { toast, toastVisible, showToast, dismissToast } = useToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);

    // ── Validations ──
    const _checkValidations = () => {
        if (checkIsEmpty(email)) { showToast(t('email_required')); return false }
        if (!isValidEmail(email)) { showToast(t('email_invalid')); return false }
        if (checkIsEmpty(password)) { showToast(t('password_required')); return false }
        return true
    }

    // ── Submit handler ──
    const handleLogin = async (e) => {
        e.preventDefault()

        if (!_checkValidations()) return

        setLoading(true);
        try {
            await loginUser({ email, password });
            navigate(navigationStrings.HOME)
        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message)
            } else {
                showToast(t('server_not_reachable'))
            }
        }
        finally {
            setLoading(false);
        }
    }


    const handleGoogleAuth = async () => {
        setLoading(true)
        try {
            await googleLogin()
            navigate(navigationStrings.HOME)
        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message)
            } else {
                showToast(t('server_not_reachable'))
            }
        } finally {
            setLoading(false)
        }
    }

    const handleFacebookAuth = async () => {
        setLoading(true)
        try {
            await facebookLogin()
            navigate(navigationStrings.HOME)
        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message)
            } else {
                showToast(t('server_not_reachable'))
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] flex'>

            <Toast
                toast={toast}
                toastVisible={toastVisible}
                dismissToast={dismissToast}
            />

            <LoginLeftPanel />

            <div className='w-full lg:w-[55%] bg-[var(--color-bg)] lg:bg-[var(--color-card)] flex flex-col justify-center px-8 md:px-16 py-10'>

                <BrandLogo />

                <div className='flex justify-end mb-6'>
                    <p className='text-zinc-400 text-sm'>
                        {t('new_here')}{' '}
                        <span
                            onClick={() => navigate(navigationStrings.SIGNUP)}
                            className='text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200 font-medium'
                        >
                            {t('create_account_link')}
                        </span>
                    </p>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <div className='w-14 h-14 rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0'>
                        <Lock size={22} className='text-emerald-400' />
                    </div>
                    <div>
                        <h1 className='text-white text-2xl font-bold tracking-tight'>{t('log_in')}</h1>
                        <p className='text-zinc-400 text-sm'>{t('login_subheading')}</p>
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
                    loading={loading}
                />

                <SocialButtons onGoogleAuth={handleGoogleAuth} onFacebookAuth={handleFacebookAuth} />

                <p className='text-zinc-500 text-xs text-center mt-5'>
                    <Trans i18nKey='login_terms_agreement' ns='auth'>
                        By logging in, you agree to our <span onClick={() => navigate(navigationStrings.TERMS)} className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>Terms of Service</span> and <span onClick={() => navigate(navigationStrings.PRIVACY_POLICY)} className='text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors duration-200'>Privacy Policy</span>
                    </Trans>
                </p>

            </div>
        </div>
    )
}

export default Login