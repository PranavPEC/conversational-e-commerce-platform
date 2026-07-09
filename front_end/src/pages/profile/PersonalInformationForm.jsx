import { useState, useEffect } from 'react'
import { updateUserProfile } from '../../redux/reduxActions'
import useToast from '../../utils/useToast'
import Toast from '../../components/common_components/Toast'
import PrimaryButton from '../../components/common_components/PrimaryButton'

// ── Props ──
//   userData    — from Redux state.auth
//   isEditing   — bool, owned by Profile.jsx
//   onCancel    — turns isEditing off without saving
//   onSaved     — turns isEditing off after a successful save

function PersonalInformationForm({ userData, isEditing, onCancel, onSaved }) {
    const { toast, toastVisible, showToast, dismissToast } = useToast()
    const formatDOB = (value) => (value ? value.slice(0, 10) : '')
    // ── Local form state ──
    // Seeded from userData. Only meaningful while isEditing is true —
    // while it's false, the inputs are disabled and just display these values.
    const [form, setForm] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        dateOfBirth:  formatDOB(userData?.dateOfBirth) || '',
        gender: userData?.gender || '',
    })

    const [saving, setSaving] = useState(false)
    
    // ── Re-sync fields every time edit mode is (re)entered ──
    // Without this, opening "Edit Profile" a second time would still show
    // whatever was typed and then cancelled last time, instead of the
    // actual current values from Redux.
    useEffect(() => {
        if (isEditing) {
            setForm({
                name: userData?.name || '',
                phone: userData?.phone || '',
                dateOfBirth:  formatDOB(userData?.dateOfBirth) || '',
                gender: userData?.gender || '',
            })
        }
    }, [isEditing, userData])

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
    }

    // ── Submit Handler ──
    const handleSave = async () => {
        if (!form.name.trim()) {
            showToast('Name cannot be empty', 'error')
            return
        }

        setSaving(true)
        try {
            await updateUserProfile({
                id: userData._id,
                name: form.name,
                email: userData.email,   // read-only in this form, sent unchanged
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
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
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        />
                    </div>

                    {/* ── Email — always read-only; changing it needs a separate verified flow ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Email Address</label>
                        <input
                            type='email'
                            value={userData?.email || ''}
                            disabled
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed'
                        />
                    </div>

                    {/* ── Phone Number ── */}
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>Phone Number</label>
                        <input
                            type='tel'
                            value={form.phone}
                            onChange={handleChange('phone')}
                            disabled={!isEditing}
                            placeholder='+91 00000 00000'
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus:border-emerald-500 transition-colors duration-200'
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