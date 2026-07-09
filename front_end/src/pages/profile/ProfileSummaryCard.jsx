import { Camera, Pencil } from 'lucide-react'
import { getInitial } from '../../utils/CommonFunctions.js'

// ── Top card on the Profile page ──
// Props:
//   userData    — from Redux state.auth, same object Navbar reads
//   isEditing   — bool, lifted up in Profile.jsx
//   onEditClick — turns isEditing on in the parent

function ProfileSummaryCard({ userData, isEditing, onEditClick }) {

    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4'>

            {/* ── Avatar + Name + Email ── */}
            <div className='flex items-center gap-4'>

                {/* ── Avatar ── */}
                <div className='relative flex-shrink-0'>
                    {userData?.profileImage ? (
                        <img
                            src={userData.profileImage}
                            alt={userData.name}
                            className='w-20 h-20 rounded-full object-cover border border-zinc-700'
                        />
                    ) : (
                        <div className='w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-semibold'>
                            {getInitial(userData)}
                        </div>
                    )}

                    {/* ── Avatar upload — not functional yet ── */}
                    <button
                        onClick={() => {}}
                        aria-label='Change profile photo'
                        className='absolute bottom-0 right-0 w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors duration-200 cursor-pointer'
                    >
                        <Camera size={13} />
                    </button>
                </div>

                {/* ── Name + Email ── */}
                <div>
                    <h2 className='text-white text-lg font-semibold'>{userData?.name}</h2>
                    <p className='text-zinc-500 text-sm mt-0.5'>{userData?.email}</p>
                </div>

            </div>

            {/* ── Edit Profile — hidden while already editing, form below handles Save/Cancel ── */}
            {!isEditing && (
                <button
                    onClick={onEditClick}
                    className='flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 transition-colors duration-200 cursor-pointer'
                >
                    <Pencil size={14} />
                    Edit Profile
                </button>
            )}

        </div>
    )
}

export default ProfileSummaryCard