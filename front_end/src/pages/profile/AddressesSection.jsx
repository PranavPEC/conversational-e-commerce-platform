import { MapPin, Plus } from 'lucide-react'

// ── Static placeholder — address CRUD is a future feature ──
// No props needed yet. Once addresses exist as a real backend feature,
// this becomes a container: fetch addresses, map over them, "View all"
// routes to /addresses, "Add Address" opens a form/modal.

function AddressesSection() {
    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6'>

            {/* ── Header ── */}
            <div className='flex items-center justify-between mb-5'>
                <h3 className='text-white text-lg font-semibold'>Addresses</h3>
                <button
                    onClick={() => {}}
                    className='text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 cursor-pointer'
                >
                    View all
                </button>
            </div>

            {/* ── Empty state — no fake address cards, this feature doesn't exist yet ── */}
            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
                <div className='w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center'>
                    <MapPin size={20} className='text-zinc-500' />
                </div>
                <p className='text-zinc-400 text-sm'>No saved addresses yet.</p>
                <button
                    onClick={() => {}}
                    className='flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 cursor-pointer'
                >
                    <Plus size={15} />
                    Add Address
                </button>
            </div>

        </div>
    )
}

export default AddressesSection