import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

// ── Language Toggle Card ──
// Same card styling as ThemeToggleCard.
// Unlike theme, language state lives in i18next itself (not Redux) —
// useTranslation's `i18n` object is already reactive, so no extra
// state management is needed here.

function LanguageToggleCard() {
    const { i18n } = useTranslation()
    const { t } = useTranslation('settings')  // for translation keys in settings.json
    const isArabic = i18n.language === 'ar'

    const toggleLanguage = () => {
        const next = isArabic ? 'en' : 'ar'
        i18n.changeLanguage(next)
    }

    return (
        <div className='bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6'>

            {/* ── Card Title ── */}
            <h2 className='text-[var(--color-text-primary)] text-lg font-semibold mb-1'>
                {t('language')}
            </h2>
            <p className='text-[var(--color-text-muted)] text-sm mb-6'>
                {t('preferred_language')}
            </p>

            {/* ── Toggle Row ── */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Languages size={20} className='text-emerald-500' />
                    <div>
                        <p className='text-[var(--color-text-primary)] text-sm font-medium'>
                            {isArabic ? t('arabic') : t('english')}
                        </p>
                        <p className='text-[var(--color-text-muted)] text-xs'>
                            {isArabic
                                ? t('switch_to_english')
                                : t('switch_to_arabic')
                            }
                        </p>
                    </div>
                </div>

                {/* ── Toggle Switch ── */}
                <button
                    onClick={toggleLanguage}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                        isArabic ? 'bg-emerald-500' : 'bg-zinc-300'
                    }`}
                    aria-label={t('toggle_language')}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            isArabic ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        </div>
    )
}

export default LanguageToggleCard