// ── Settings Header ──
// Same pattern as OrdersHeader — just title + description for the page.

function SettingsHeader() {
    return (
        <div>
            <h1 className='text-[var(--color-text-primary)] text-2xl font-bold tracking-tight'>
                Settings
            </h1>
            <p className='text-[var(--color-text-muted)] text-sm mt-1'>
                Manage your preferences and account settings
            </p>
        </div>
    )
}

export default SettingsHeader
