import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUserOrders } from '../../redux/reduxActions'

import AccountSidebar from '../../components/common_components/AccountSidebar'
import ProfileSummaryCard from './ProfileSummaryCard'
import ProfileStatsGrid from './ProfileStatsGrid'
import PersonalInformationForm from './PersonalInformationForm'
import AddressesSection from './AddressesSection'

function Profile() {
    const { userData } = useSelector(state => state.auth)
    const { orders } = useSelector(state => state.order)

    // ── Edit mode ──
    // Lifted up here because ProfileSummaryCard, ProfileStatsGrid and
    // PersonalInformationForm all need to react to it.
    const [isEditing, setIsEditing] = useState(false)

    // ── Pending avatar selection ──
    // Also lifted up: ProfileSummaryCard is where the picker lives and shows
    // the preview, but PersonalInformationForm is where the actual "Save
    // Changes" button and handleSave live — the file has to be visible to
    // both, so it lives here in their shared parent.
    // avatarFile    — the actual File object, sent to the backend on save
    // avatarPreview — a blob URL just for on-screen preview, discarded after
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const handleAvatarChange = (file, previewUrl) => {
        setAvatarFile(file)
        setAvatarPreview(previewUrl)
    }

    // ── Clears any picked-but-not-yet-saved avatar ──
    // Called on both Cancel (discard) and a successful Save (already
    // persisted, so the local pending copy is no longer needed — the fresh
    // userData.profileImage from Redux takes over from here).
    const resetAvatarSelection = () => {
        setAvatarFile(null)
        setAvatarPreview(null)
    }

    const handleCancelEdit = () => {
        resetAvatarSelection()
        setIsEditing(false)
    }

    const handleSaved = () => {
        resetAvatarSelection()
        setIsEditing(false)
    }

    // ── Fetch orders for the stats grid ──
    useEffect(() => {
        fetchUserOrders()   // plain async function — no dispatch(), same convention as Orders.jsx
    }, [])

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-8'>

                {/* ── Left nav — shared component, also used by Orders.jsx ── */}
                <AccountSidebar />

                {/* ── Right column — everything specific to the Profile page ── */}
                <div className='flex-1 flex flex-col gap-6 min-w-0'>

                    {/* ── Page Heading ── */}
                    <div>
                        <h1 className='text-[var(--color-text-primary)] text-2xl font-bold tracking-tight'>Profile</h1>
                        <p className='text-[var(--color-text-muted)] text-sm mt-1'>
                            Manage your personal information and account details
                        </p>
                    </div>

                    {/* ── Avatar + name + Edit Profile trigger ── */}
                    <ProfileSummaryCard
                        userData={userData}
                        isEditing={isEditing}
                        onEditClick={() => setIsEditing(true)}
                        avatarPreview={avatarPreview}
                        onAvatarChange={handleAvatarChange}
                    />

                    {/* ── Orders / Wishlist / Addresses / Account stat cards ── */}
                    <ProfileStatsGrid ordersCount={orders.length} />

                    {/* ── Editable form — reads/writes isEditing via props, now also
                        carries the pending avatar file so it saves together with
                        name/phone/DOB/gender in a single request ── */}
                    <PersonalInformationForm
                        userData={userData}
                        isEditing={isEditing}
                        avatarFile={avatarFile}
                        onCancel={handleCancelEdit}
                        onSaved={handleSaved}
                    />

                    {/* ── Static placeholder — real address CRUD is a future feature ── */}
                    <AddressesSection />

                </div>

            </div>
        </div>
    )
}

export default Profile