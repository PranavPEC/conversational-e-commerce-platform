import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, Upload } from 'lucide-react'
import { submitSellerKycDocuments } from '../../redux/reduxActions'
import useToast from '../../utils/useToast.js'
import Toast from '../../components/common_components/Toast.jsx'
import PrimaryButton from '../../components/common_components/PrimaryButton.jsx'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'
import {
    checkAadharValidation,
    checkPanValidation,
} from '../../utils/validations.js'

function SellerKycDocuments() {
    const { t } = useTranslation('seller')
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.auth)
    const { sellerLoading } = useSelector(state => state.seller)
    const { toast, toastVisible, showToast, dismissToast } = useToast()

    const [aadharNumber, setAadharNumber] = useState('')
    const [aadharImage, setAadharImage] = useState(null)
    const [panNumber, setPanNumber] = useState('')
    const [panImage, setPanImage] = useState(null)
    const [gstin, setGstin] = useState('')

    useEffect(() => {
        if (userData && userData.role !== 'seller') {
            navigate(navigationStrings.HOME, { replace: true })
        }
    }, [navigate, userData])

    if (!userData || userData.role !== 'seller') return null

    const hasSubmittedDocuments = !!userData?.sellerDocuments?.submittedAt

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!checkAadharValidation(aadharNumber, showToast, t)) return
        if (!checkPanValidation(panNumber, showToast, t)) return
        if (!aadharImage) {
            showToast(t('aadhar_image_required'))
            return
        }
        if (!panImage) {
            showToast(t('pan_image_required'))
            return
        }

        const formData = new FormData()
        formData.append('aadharNumber', aadharNumber)
        formData.append('aadharImage', aadharImage)
        formData.append('panNumber', panNumber.toUpperCase())
        formData.append('panImage', panImage)
        if (gstin.trim()) formData.append('gstin', gstin.trim())

        try {
            await submitSellerKycDocuments(formData)
            navigate(navigationStrings.SELLER)
        } catch (error) {
            showToast(error.response?.data?.message || t('documents_submit_failed'))
        }
    }

    if (hasSubmittedDocuments) {
        return (
            <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10 flex items-center justify-center'>
                <div className='max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center gap-4'>
                    <div className='w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400'>
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className='text-white text-xl font-bold tracking-tight'>
                            {t('documents_submitted_title')}
                        </h1>
                        <p className='text-zinc-400 text-sm mt-2 leading-6'>
                            {t('documents_submitted_message')}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <Toast toast={toast} toastVisible={toastVisible} dismissToast={dismissToast} />

            <div className='max-w-2xl mx-auto'>
                <div className='mb-8'>
                    <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                        {t('seller')}
                    </p>
                    <h1 className='text-white text-2xl font-bold tracking-tight'>
                        {t('kyc_page_title')}
                    </h1>
                    <p className='text-zinc-400 text-sm mt-2'>
                        {t('kyc_page_subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>{t('aadhar_number_label')}</label>
                        <input
                            type='text'
                            inputMode='numeric'
                            maxLength={12}
                            placeholder={t('aadhar_number_placeholder')}
                            value={aadharNumber}
                            onChange={(event) => setAadharNumber(event.target.value.replace(/\D/g, ''))}
                            className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>{t('aadhar_upload_label')}</label>
                        <div className='relative'>
                            <Upload size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none' />
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(event) => setAadharImage(event.target.files?.[0] || null)}
                                className='w-full h-12 bg-zinc-800 text-zinc-400 border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm transition-colors duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-white file:text-xs cursor-pointer'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>{t('pan_number_label')}</label>
                        <input
                            type='text'
                            maxLength={10}
                            placeholder={t('pan_number_placeholder')}
                            value={panNumber}
                            onChange={(event) => setPanNumber(event.target.value.toUpperCase())}
                            className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>{t('pan_upload_label')}</label>
                        <div className='relative'>
                            <Upload size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none' />
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(event) => setPanImage(event.target.files?.[0] || null)}
                                className='w-full h-12 bg-zinc-800 text-zinc-400 border border-zinc-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm transition-colors duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-white file:text-xs cursor-pointer'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-zinc-300 text-sm font-medium'>{t('gstin_number_label')}</label>
                        <input
                            type='text'
                            placeholder={t('gstin_number_placeholder')}
                            value={gstin}
                            onChange={(event) => setGstin(event.target.value.toUpperCase())}
                            className='w-full h-12 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                        />
                    </div>

                    <PrimaryButton
                        type='submit'
                        text={t('submit_documents')}
                        loading={sellerLoading}
                        LoadingText={t('submitting_documents')}
                        disabled={sellerLoading}
                        className='w-full h-12 mt-1'
                        textColor='text-white'
                    />
                </form>
            </div>
        </div>
    )
}

export default SellerKycDocuments
