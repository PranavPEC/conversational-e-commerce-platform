import { useTranslation } from 'react-i18next'

// Hardcoded so "last updated" changes only when the legal text itself changes.
const LAST_UPDATED = new Date('2026-09-01')

function Terms() {
    const { t, i18n } = useTranslation('legal')
    const lastUpdated = new Intl.DateTimeFormat(i18n.language, {
        month: 'long',
        year: 'numeric',
    }).format(LAST_UPDATED)

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-12'>
            <div className='max-w-2xl mx-auto'>
                <h1 className='text-white text-3xl font-bold tracking-tight'>
                    {t('terms_title')}
                </h1>
                <p className='text-zinc-500 text-sm mt-2'>
                    {t('last_updated', { date: lastUpdated })}
                </p>
                <div className='text-zinc-400 text-sm leading-7 whitespace-pre-line mt-8'>
                    {t('terms_body')}
                </div>
            </div>
        </div>
    )
}

export default Terms