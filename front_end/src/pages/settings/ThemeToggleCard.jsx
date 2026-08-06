import { useSelector } from 'react-redux'
import { Sun, Moon } from 'lucide-react'
import { toggleTheme } from '../../redux/reduxActions'
import { useTranslation } from 'react-i18next'
// ── Theme Toggle Card ──
// A settings card with a simple toggle switch to flip between dark/light.
// Uses the same card styling as the rest of the app (zinc-900 bg, zinc-800 border).

function ThemeToggleCard() {
    const { theme } = useSelector(state => state.theme)
    const isDark = theme === 'dark'
    const { t } = useTranslation('settings')

    return (
        <div className='bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6'>

            {/* ── Card Title ── */}
            <h2 className='text-[var(--color-text-primary)] text-lg font-semibold mb-1'>
                {t('appearance')}   
            </h2>
            <p className='text-[var(--color-text-muted)] text-sm mb-6'>
                {t('appearance_description')}
            </p>

            {/* ── Toggle Row ── */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {isDark ? (
                        <Moon size={20} className='text-emerald-400' />
                    ) : (
                        <Sun size={20} className='text-emerald-600' />
                    )}
                    <div>
                        <p className='text-[var(--color-text-primary)] text-sm font-medium'>
                            {isDark ? t('dark_mode') : t('light_mode')}
                        </p>
                        <p className='text-[var(--color-text-muted)] text-xs'>
                            {isDark
                                ? t('dark_mode_description')
                                : t('light_mode_description')
                            }
                        </p>
                    </div>
                </div>

                {/* ── Toggle Switch ── */}
                <button
                    onClick={toggleTheme}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                        isDark ? 'bg-emerald-500' : 'bg-zinc-300'
                    }`}
                    aria-label={t('toggle_theme')}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            isDark ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        </div>
    )
}

export default ThemeToggleCard
