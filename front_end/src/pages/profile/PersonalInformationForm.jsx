import { useState, useEffect } from 'react'
import { updateUserProfile } from '../../redux/reduxActions'
import useToast from '../../utils/useToast'
import Toast from '../../components/common_components/Toast'
import PrimaryButton from '../../components/common_components/PrimaryButton'
import { checkNameValidation, checkPhoneValidation, checkDateOfBirthValidation } from '../../utils/validations'

// ── Props ──
//   userData    — from Redux state.auth
//   isEditing   — bool, owned by Profile.jsx
//   avatarFile  — pending File from ProfileSummaryCard's picker, or null —
//                 sent along in the same save request when present
//   onCancel    — turns isEditing off without saving (also clears avatarFile in Profile.jsx)
//   onSaved     — turns isEditing off after a successful save

const formatDOB = (value) => (value ? value.slice(0, 10) : '')

function PersonalInformationForm({ userData, isEditing, avatarFile, onCancel, onSaved }) {
    const { toast, toastVisible, showToast, dismissToast } = useToast()

    // ── Local form state ──
    const [form, setForm] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        dateOfBirth: formatDOB(userData?.dateOfBirth),
        gender: userData?.gender || '',
    })

    const [saving, setSaving] = useState(false)

    // ── Re-sync fields every time edit mode is (re)entered ──
    useEffect(() => {
        if (isEditing) {
            setForm({
                name: userData?.name || '',
                phone: userData?.phone || '',
                dateOfBirth: formatDOB(userData?.dateOfBirth),
                gender: userData?.gender || '',
            })
        }
    }, [isEditing, userData])

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
    }

    // ── Phone gets its own handler ──
    // Strips anything non-numeric as the user types and caps it at 10
    // characters — this is a UX nicety layered on top of checkPhoneValidation
    // below, not a replacement for it. Someone pasting "abc1234567890" should
    // never even see letters land in the field in the first place.
    const handlePhoneChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10)
        setForm(prev => ({ ...prev, phone: digitsOnly }))
    }

    // ── Submit Handler ──
    // Saves name/phone/DOB/gender AND the pending avatar (if any) in one
    // single request — updateUserProfile now always builds multipart
    // FormData, so passing profileImageFile: null here is harmless (your
    // controller only touches profileImage when a real file is present).
    const handleSave = async () => {
        // ── Validation ──
        // Same pattern as Login/SignUp: each check shows its own toast and
        // returns false on failure, caller returns early on the first one
        // that fails. Phone and DOB are optional, so their validators pass
        // straight through when the field is empty.
        if (!checkNameValidation(form.name, showToast)) return
        if (!checkPhoneValidation(form.phone, showToast)) return
        if (!checkDateOfBirthValidation(form.dateOfBirth, showToast)) return

        setSaving(true)
        try {
            await updateUserProfile({
                id: userData._id,
                name: form.name,
                email: userData.email,   // read-only in this form, sent unchanged
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                profileImageFile: avatarFile,
            })
            showToast('Profile updated successfully', 'success')
            onSaved()
        } catch (error) {
            showToast(error?.response?.data?.message || 'Failed to update profile', 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Toast toast={toast} toastVisible={toastVisible} dismissToast={dismissToast} />

            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6'>

                <h3 className='text-white text-lg font-semibold mb-5'>Personal Information</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                    {/* ── Full Name ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Full Name</label>
                        <input
                            type='text'
                            value={form.name}
                            onChange={handleChange('name')}
                            disabled={!isEditing}
                            className='w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        />
                    </div>

                    {/* ── Email — always read-only; changing it needs a separate verified flow ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Email Address</label>
                        <input
                            type='email'
                            value={userData?.email || ''}
                            disabled
                            className='w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-muted)] cursor-not-allowed'
                        />
                    </div>

                    {/* ── Phone Number ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Phone Number</label>
                        <input
                            type='tel'
                            inputMode='numeric'
                            maxLength={10}
                            value={form.phone}
                            onChange={handlePhoneChange}
                            disabled={!isEditing}
                            placeholder='10-digit mobile number'
                            className='w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        />
                    </div>

                    {/* ── Date of Birth ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Date of Birth</label>
                        <input
                            type='date'
                            value={form.dateOfBirth}
                            onChange={handleChange('dateOfBirth')}
                            disabled={!isEditing}
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        />
                    </div>

                    {/* ── Gender ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Gender</label>
                        <select
                            value={form.gender}
                            onChange={handleChange('gender')}
                            disabled={!isEditing}
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        >
                            <option value=''>Select</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>

                </div>

                {/* ── Cancel / Save — only visible while editing ── */}
                {isEditing && (
                    <div className='flex items-center justify-end gap-3 mt-6'>
                        <button
                            onClick={onCancel}
                            disabled={saving}
                            className='px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Cancel
                        </button>
                        <PrimaryButton
                            text='Save Changes'
                            onClick={handleSave}
                            loading={saving}
                            LoadingText='Saving...'
                        />
                    </div>
                )}

            </div>
        </>
    )
}

export default PersonalInformationForm