import { useTranslation } from 'react-i18next'
// ── Settings Header ──
// Same pattern as OrdersHeader — just title + description for the page.
function SettingsHeader() {
    const { t } = useTranslation('settings')
    return (
        <div>
            <h1 className='text-[var(--color-text-primary)] text-2xl font-bold tracking-tight'>
                {t('settings')}
            </h1>
            <p className='text-[var(--color-text-muted)] text-sm mt-1'>
                {t('settings_description')}
            </p>
        </div>
    )
}

export default SettingsHeader
