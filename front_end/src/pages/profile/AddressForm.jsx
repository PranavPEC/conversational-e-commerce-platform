import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createAddress, updateAddress } from '../../redux/reduxActions'
import useToast from '../../utils/useToast'
import { useTranslation } from 'react-i18next'
import Toast from '../../components/common_components/Toast'
import PrimaryButton from '../../components/common_components/PrimaryButton'
import {
    checkAddressValidation,
    checkCityValidation,
    checkStateValidation,
    checkNameValidation,
    checkPhoneValidation,
    checkPincodeValidation,
} from '../../utils/validations'

// ── Props ──
//   isOpen         — bool, controls whether the modal renders at all
//   editingAddress — an address object (Edit mode) or null (Add mode)
//   onClose        — closes the modal, called on Cancel and after a successful save

const EMPTY_FORM = {
    label: 'Home',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
}

function AddressForm({ isOpen, editingAddress, onClose }) {
    const { toast, toastVisible, showToast, dismissToast } = useToast()
    const { t } = useTranslation('profile')
    const { t: authT } = useTranslation('auth')

    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    // ── Re-sync form fields every time the modal opens ──
    // Add mode → blank form. Edit mode → pre-filled from editingAddress.
    // Same "re-sync on open" pattern as PersonalInformationForm's isEditing effect.
    useEffect(() => {
        if (isOpen) {
            if (editingAddress) {
                setForm({
                    label: editingAddress.label || 'Home',
                    fullName: editingAddress.fullName || '',
                    phone: editingAddress.phone || '',
                    line1: editingAddress.line1 || '',
                    line2: editingAddress.line2 || '',
                    city: editingAddress.city || '',
                    state: editingAddress.state || '',
                    pincode: editingAddress.pincode || '',
                    isDefault: editingAddress.isDefault || false,
                })
            } else {
                setForm(EMPTY_FORM)
            }
        }
    }, [isOpen, editingAddress])

    if (!isOpen) return null

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
    }

    // ── Digit-only handlers — same filtering pattern as PersonalInformationForm's phone field ──
    const handlePhoneChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10)
        setForm(prev => ({ ...prev, phone: digitsOnly }))
    }

    const handlePincodeChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6)
        setForm(prev => ({ ...prev, pincode: digitsOnly }))
    }

    // ── Validation ──
    // fullName/phone/line1/city/state/pincode are all required here (unlike
    // Profile's phone/DOB, which were optional) — so checkIsEmpty runs first
    // on each, then the shared format validators run on top where they exist.
    const _checkValidations = () => {
        if (!checkNameValidation(form.fullName, showToast, authT)) return false

        if (!checkPhoneValidation(form.phone, showToast, authT)) return false

        if (!checkAddressValidation(form.line1, showToast, authT)) return false
        if (!checkCityValidation(form.city, showToast, authT)) return false
        if (!checkStateValidation(form.state, showToast, authT)) return false

        if (!checkPincodeValidation(form.pincode, showToast, authT)) return false

        return true
    }

    // ── Submit Handler ──
    const handleSubmit = async () => {
        if (!_checkValidations()) return

        setSaving(true)
        try {
            if (editingAddress) {
                await updateAddress(editingAddress._id, form)
                showToast(t('address_updated_successfully'), 'success')
            } else {
                await createAddress(form)
                showToast(t('address_added_successfully'), 'success')
            }
            onClose()
        } catch (error) {
            showToast(error?.response?.data?.message || t('address_save_failed'), 'error')
        } finally {
            setSaving(false)
        }
    }

    // Editing the address that's already the default → don't show the
    // checkbox at all. Unchecking it here would leave the user with zero
    // default addresses, which isn't a supported state — switching default
    // is what the "Set as Default" button on a different card is for.
    const showDefaultCheckbox = !(editingAddress && editingAddress.isDefault)

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>

            <Toast toast={toast} toastVisible={toastVisible} dismissToast={dismissToast} />

            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-5'>

                {/* ── Header ── */}
                <div className='flex items-center justify-between'>
                    <h3 className='text-white text-lg font-semibold'>
                        {editingAddress ? t('edit_address') : t('add_address')}
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label='Close'
                        className='text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer'
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Label ── */}
                <div>
                    <label className='block text-zinc-400 text-xs mb-1.5'>{t('label')}</label>
                    <select
                        value={form.label}
                        onChange={handleChange('label')}
                        className='w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                    >
                        <option value='Home'>{t('home')}</option>
                        <option value='Work'>{t('work')}</option>
                        <option value='Other'>{t('other')}</option>
                    </select>
                </div>

                {/* ── Full Name ── */}
                <div>
                    <label className='block text-zinc-400 text-xs mb-1.5'>{t('full_name')}</label>
                    <input
                        type='text'
                        value={form.fullName}
                        onChange={handleChange('fullName')}
                        className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                    />
                </div>

                {/* ── Phone ── */}
                <div>
                    <label className='block text-zinc-400 text-xs mb-1.5'>{t('phone_number')}</label>
                    <input
                        type='tel'
                        inputMode='numeric'
                        maxLength={10}
                        value={form.phone}
                        onChange={handlePhoneChange}
                        placeholder={t('phone_placeholder')}
                        className='w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                    />
                </div>

                {/* ── Address Line 1 ── */}
                <div>
                    <label className='block text-zinc-400 text-xs mb-1.5'>{t('address_line_1')}</label>
                    <input
                        type='text'
                        value={form.line1}
                        onChange={handleChange('line1')}
                        placeholder={t('address_line_1_placeholder')}
                        className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                    />
                </div>

                {/* ── Address Line 2 (optional) ── */}
                <div>
                    <label className='block text-zinc-400 text-xs mb-1.5'>{t('address_line_2')}</label>
                    <input
                        type='text'
                        value={form.line2}
                        onChange={handleChange('line2')}
                        placeholder={t('address_line_2_placeholder')}
                        className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                    />
                </div>

                {/* ── City / State ── */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>{t('city')}</label>
                        <input
                            type='text'
                            value={form.city}
                            placeholder={t('city_placeholder')}
                            onChange={handleChange('city')}
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        />
                    </div>
                    <div>
                        <label className='block text-zinc-400 text-xs mb-1.5'>{t('state')}</label>
                        <input
                            type='text'
                            value={form.state}
                            placeholder={t('state_placeholder')}
                            onChange={handleChange('state')}
                            className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                        />
                    </div>
                </div>

                {/* ── Pincode ── */}
                <div>
                    <label className='block text-zinc-400 text-xs mb-1.5'>{t('pincode')}</label>
                    <input
                        type='text'
                        inputMode='numeric'
                        maxLength={6}
                        value={form.pincode}
                        onChange={handlePincodeChange}
                        placeholder={t('pincode_placeholder')}
                        className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200'
                    />
                </div>

                {/* ── Set as Default ── */}
                {showDefaultCheckbox && (
                    <label className='flex items-center gap-2.5 cursor-pointer select-none'>
                        <input
                            type='checkbox'
                            checked={form.isDefault}
                            onChange={(e) => setForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className='w-4 h-4 rounded border-zinc-700 accent-emerald-500 cursor-pointer'
                        />
                        <span className='text-zinc-300 text-sm'>{t('set_default_address')}</span>
                    </label>
                )}

                {/* ── Actions ── */}
                <div className='flex items-center justify-end gap-3 pt-1'>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className='px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {t('cancel')}
                    </button>
                    <PrimaryButton
                        text={editingAddress ? t('save_changes') : t('add_address')}
                        onClick={handleSubmit}
                        loading={saving}
                        LoadingText={t('saving')}
                    />
                </div>

            </div>
        </div>
    )
}

export default AddressForm