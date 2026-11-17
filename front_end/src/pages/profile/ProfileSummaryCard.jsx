import { Pencil } from 'lucide-react'
import { getInitial } from '../../utils/CommonFunctions.js'
import { useTranslation } from 'react-i18next'
import AvatarPicker from '../../components/common_components/AvatarPicker.jsx'

// ── Top card on the Profile page ──
// Props:
//   userData        — from Redux state.auth
//   isEditing       — bool, lifted up in Profile.jsx
//   onEditClick     — turns isEditing on in the parent
//   avatarPreview   — blob URL for a newly-picked (not yet saved) avatar
//   onAvatarChange  — (file, previewUrl) => void, bubbles the pick up to Profile.jsx

function ProfileSummaryCard({ userData, isEditing, onEditClick, avatarPreview, onAvatarChange }) {
    const { t } = useTranslation('profile')

    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4'>

            {/* ── Avatar + Name + Email ── */}
            <div className='flex items-center gap-4'>

                {/* ── Avatar ──
                    Only becomes a clickable picker while isEditing is true —
                    same gating as the form fields below it. Otherwise it's
                    just a plain display, identical to how it looked before
                    this feature existed. ── */}
                {isEditing ? (
                    <AvatarPicker
                        frontendImage={avatarPreview}
                        existingImage={userData?.profileImage}
                        onImageChange={onAvatarChange}
                        initial={!userData?.profileImage ? getInitial(userData) : null}
                        size='lg'
                    />
                ) : (
                    userData?.profileImage ? (
                        <img
                            src={userData.profileImage}
                            alt={userData.name}
                            referrerPolicy='no-referrer'
                            className='w-20 h-20 rounded-full object-cover border border-zinc-700 flex-shrink-0'
                        />
                    ) : (
                        <div className='w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-semibold flex-shrink-0'>
                            {getInitial(userData)}
                        </div>
                    )
                )}

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
                    {t('edit_profile')}
                </button>
            )}

        </div>
    )
}

export default ProfileSummaryCard