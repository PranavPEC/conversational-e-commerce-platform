import { useTranslation } from 'react-i18next'
import { Hourglass } from 'lucide-react'

function SellerPendingApproval() {
    const { t } = useTranslation('seller')

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
            </div>
        </div>
    )
}

export default SellerPendingApproval
