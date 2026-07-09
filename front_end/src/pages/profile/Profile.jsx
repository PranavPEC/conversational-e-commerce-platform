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
    // Lifted up here (not inside ProfileSummaryCard or the form) because
    // BOTH children need to react to it: the summary card's "Edit Profile"
    // button turns it on, and the form uses it to unlock its inputs.
    // This is the same "lift state to the nearest shared parent" pattern
    // your project already uses — e.g. Home.jsx owns `products` and hands
    // slices of it down to FeaturedProducts as props.
    const [isEditing, setIsEditing] = useState(false)

    // ── Fetch orders for the stats grid ──
    // The user may already have orders in Redux (e.g. they visited /orders
    // earlier this session), but we re-fetch here so the "Total Orders"
    // number on this page is correct even on a hard refresh or a direct
    // visit to /profile without having gone through /orders first.
    useEffect(() => {
        fetchUserOrders()   // plain async function — no dispatch(), same convention as Orders.jsx
    }, [])

    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-8'>

                {/* ── Left nav — shared component, will also serve Settings/Wishlist later ── */}
                <AccountSidebar />

                {/* ── Right column — everything specific to the Profile page ── */}
                <div className='flex-1 flex flex-col gap-6 min-w-0'>

                    {/* ── Page Heading ── */}
                    <div>
                        <h1 className='text-white text-2xl font-bold tracking-tight'>Profile</h1>
                        <p className='text-zinc-500 text-sm mt-1'>
                            Manage your personal information and account details
                        </p>
                    </div>

                    {/* ── Avatar + name + Edit Profile trigger ── */}
                    <ProfileSummaryCard
                        userData={userData}
                        isEditing={isEditing}
                        onEditClick={() => setIsEditing(true)}
                    />

                    {/* ── Orders / Wishlist / Addresses / Account stat cards ── */}
                    <ProfileStatsGrid ordersCount={orders.length} />

                    {/* ── Editable form — reads/writes isEditing via props ── */}
                    <PersonalInformationForm
                        userData={userData}
                        isEditing={isEditing}
                        onCancel={() => setIsEditing(false)}
                        onSaved={() => setIsEditing(false)}
                    />

                    {/* ── Static placeholder — real address CRUD is a future feature ── */}
                    <AddressesSection />

                </div>

            </div>
        </div>
    )
}

export default Profile