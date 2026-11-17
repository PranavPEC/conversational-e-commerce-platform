import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MapPin, Plus, Pencil, Trash2, Loader } from 'lucide-react'
import { fetchUserAddresses, deleteAddress, setDefaultAddress } from '../../redux/reduxActions'
import { useTranslation } from 'react-i18next'
import DeleteModal from '../../components/common_components/DeleteModal.jsx'
import AddressForm from './AddressForm.jsx'

// ── Real container now, no longer a static placeholder ──
// Fetches the user's addresses, renders them as cards, and owns all the
// local UI state (which modal/form is open) needed to add/edit/delete/
// set-default. The actual network calls all live in addressActions.js —
// this component only orchestrates when to call them.

function AddressesSection() {
    const { t } = useTranslation('profile')
    const { addresses, addressesLoading, addressesError } = useSelector(state => state.address)

    // ── Add/Edit form state ──
    // null editingAddress = "Add" mode, an address object = "Edit" mode.
    // isFormOpen is separate from editingAddress so "Add" (editingAddress
    // stays null) can still open the form.
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)

    // ── Delete confirmation state — same pattern as Seller's product delete ──
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // ── Per-address "Set as Default" loading — so only the clicked card
    // shows a spinner, not the whole section ──
    const [settingDefaultId, setSettingDefaultId] = useState(null)

    useEffect(() => {
        fetchUserAddresses()
    }, [])

    const handleAddClick = () => {
        setEditingAddress(null)
        setIsFormOpen(true)
    }

    const handleEditClick = (address) => {
        setEditingAddress(address)
        setIsFormOpen(true)
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingAddress(null)
    }

    const handleDeleteConfirm = async () => {
        setDeleting(true)
        try {
            await deleteAddress(deleteTarget._id)
            setDeleteTarget(null)
        } catch (error) {
            // addressesError is already set by the action — surfaced below
        } finally {
            setDeleting(false)
        }
    }

    const handleSetDefault = async (id) => {
        setSettingDefaultId(id)
        try {
            await setDefaultAddress(id)
        } catch (error) {
            // addressesError is already set by the action — surfaced below
        } finally {
            setSettingDefaultId(null)
        }
    }

    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6'>

            {/* ── Header ── */}
            <div className='flex items-center justify-between mb-5'>
                <h3 className='text-white text-lg font-semibold'>{t('addresses')}</h3>
                <button
                    onClick={handleAddClick}
                    className='flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 cursor-pointer'
                >
                    <Plus size={15} />
                    {t('add_address')}
                </button>
            </div>

            {/* ── Loading skeleton ── */}
            {addressesLoading && (
                <div className='flex flex-col gap-3'>
                    {[1, 2].map(i => (
                        <div key={i} className='h-24 bg-zinc-800 rounded-xl animate-pulse' />
                    ))}
                </div>
            )}

            {/* ── Error state ── */}
            {!addressesLoading && addressesError && (
                <div className='flex flex-col items-center justify-center py-8 gap-2 text-center'>
                    <p className='text-red-400 text-sm'>{addressesError}</p>
                    <button
                        onClick={() => fetchUserAddresses()}
                        className='text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 cursor-pointer'
                    >
                        {t('try_again')}    
                    </button>
                </div>
            )}

            {/* ── Empty state ── */}
            {!addressesLoading && !addressesError && addresses.length === 0 && (
                <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                    <div className='w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center'>
                        <MapPin size={20} className='text-zinc-500' />
                    </div>
                    <p className='text-zinc-400 text-sm'>{t('no_saved_addresses')}</p>
                    <button
                        onClick={handleAddClick}
                        className='flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 cursor-pointer'
                    >
                        <Plus size={15} />
                        {t('add_address')}
                    </button>
                </div>
            )}

            {/* ── Address cards ── */}
            {!addressesLoading && !addressesError && addresses.length > 0 && (
                <div className='flex flex-col gap-3'>
                    {addresses.map(address => (
                        <div
                            key={address._id}
                            className='bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3'
                        >
                            {/* ── Badges ── */}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <span className='text-xs px-2 py-0.5 rounded-full bg-[var(--color-input-bg)] text-[var(--color-text-secondary)]'>
                                    {address.label}
                                </span>
                                {address.isDefault && (
                                    <span className='text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'>
                                        {t('default')}  
                                    </span>
                                )}
                            </div>

                            {/* ── Name + Phone + Address text ── */}
                            <div>
                                <p className='text-white text-sm font-medium'>{address.fullName}</p>
                                <p className='text-zinc-500 text-xs mt-0.5'>{address.phone}</p>
                                <p className='text-zinc-400 text-sm mt-1.5 leading-relaxed'>
                                    {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} - {address.pincode}
                                </p>
                            </div>

                            {/* ── Actions ── */}
                            <div className='flex items-center gap-4 pt-1'>
                                <button
                                    onClick={() => handleEditClick(address)}
                                    className='flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs transition-colors duration-200 cursor-pointer'
                                >
                                    <Pencil size={13} /> {t('edit')}
                                </button>

                                <button
                                    onClick={() => setDeleteTarget(address)}
                                    className='flex items-center gap-1.5 text-zinc-400 hover:text-red-400 text-xs transition-colors duration-200 cursor-pointer'
                                >
                                    <Trash2 size={13} /> {t('delete')}
                                </button>

                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address._id)}
                                        disabled={settingDefaultId === address._id}
                                        className='flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-xs transition-colors duration-200 cursor-pointer disabled:opacity-50'
                                    >
                                        {settingDefaultId === address._id
                                            ? <Loader size={13} className='animate-spin' />
                                            : null
                                        }
                                        {t('set_as_default')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Add/Edit form ── */}
            <AddressForm
                isOpen={isFormOpen}
                editingAddress={editingAddress}
                onClose={handleFormClose}
            />

            {/* ── Delete confirmation ── */}
            <DeleteModal
                deleteTarget={deleteTarget}
                title={t('delete_address')}
                itemName={deleteTarget ? `${deleteTarget.label} — ${deleteTarget.line1}` : ''}
                loading={deleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />

        </div>
    )
}

export default AddressesSection