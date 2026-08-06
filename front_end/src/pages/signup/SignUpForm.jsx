
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PrimaryButton from '../../components/common_components/PrimaryButton'
// Props:
//   name, setName
//   email, setEmail
//   password, setPassword
//   confirmPassword, setConfirmPassword
//   showPassword, setShowPassword
//   showConfirm, setShowConfirm
//   handleSignUp   — form submit handler (defined in SignUp.jsx)

function SignUpForm({
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    handleSignUp,
    loading
}) {
    const { t } = useTranslation('auth')
    return (
        <form onSubmit={handleSignUp} className='flex flex-col gap-5'>

            {/* Full Name */}
            <div className='flex flex-col gap-1.5'>
                <label className='text-zinc-300 text-sm font-medium'>{t('full_name_label')}</label>
                <div className='relative'>
                    <User size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' />
                    <input
                        type='text'
                        placeholder={t('full_name_placeholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 text-sm transition-colors duration-200'
                    />
                </div>
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1.5'>
                <label className='text-zinc-300 text-sm font-medium'>{t('email_label')}</label>
                <div className='relative'>
                    <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' />
                    <input
                        type='email'
                        placeholder={t('email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 text-sm transition-colors duration-200'
                    />
                </div>
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
                <label className='text-zinc-300 text-sm font-medium'>{t('password_label')}</label>
                <div className='relative'>
                    <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('create_password_placeholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-12 text-sm transition-colors duration-200'
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword(p => !p)}
                        className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200'
                    >
                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div className='flex flex-col gap-1.5'>
                <label className='text-zinc-300 text-sm font-medium'>{t('confirm_password_label')}</label>
                <div className='relative'>
                    <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' />
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder={t('confirm_password_placeholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-12 text-sm transition-colors duration-200'
                    />
                    <button
                        type='button'
                        onClick={() => setShowConfirm(p => !p)}
                        className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200'
                    >
                        {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
            </div>

            {/* Submit */}
            
            <PrimaryButton
                text={t('sign_up')}
                type="submit"
                loading={loading}
                LoadingText={t('signing_up')}
                disabled={loading}
                icon={<ArrowRight size={16} />}
                className="w-full h-12 mt-1"
                textColor="text-white"
            />

        </form>
    )
}

export default SignUpForm
