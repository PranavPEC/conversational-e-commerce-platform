import AccountSidebar from '../../components/common_components/AccountSidebar'
import SettingsHeader from './SettingsHeader'
import ThemeToggleCard from './ThemeToggleCard'
import LanguageToggleCard from './LanguageToggleCard'
// ── Settings Page ──
// Same layout pattern as Profile.jsx and Orders.jsx:
// max-w-6xl wrapper → AccountSidebar on left → content on right.
// This keeps the sidebar visually aligned across all account pages.

function Settings() {
    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-8'>

                {/* ── Left nav — shared sidebar ── */}
                <AccountSidebar />

                {/* ── Right column — settings content ── */}
                <div className='flex-1 flex flex-col gap-6 min-w-0'>
                    <SettingsHeader />
                    <ThemeToggleCard />
                    <LanguageToggleCard />
                </div>

            </div>
        </div>
    )
}

export default Settings
