import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Hourglass } from 'lucide-react'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

function SellerPendingApproval() {
    const { t } = useTranslation('seller')
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.auth)
    const hasSubmittedDocuments = !!userData?.sellerDocuments?.submittedAt

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10 flex items-center justify-center'>
            <div className='max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center gap-4'>
                <div className='w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400'>
                    <Hourglass size={24} />
                </div>
                <div>
                    <h1 className='text-white text-xl font-bold tracking-tight'>
                        {t('pending_approval_title')}
                    </h1>
                    <p className='text-zinc-400 text-sm mt-2 leading-6'>
                        {t('pending_approval_message')}
                    </p>
                </div>
                {!hasSubmittedDocuments && (
                    <button
                        onClick={() => navigate(navigationStrings.SELLER_KYC_DOCUMENTS)}
                        className='px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t('complete_verification_cta')}
                    </button>
                )}
            </div>
        </div>
    )
}

export default SellerPendingApproval
