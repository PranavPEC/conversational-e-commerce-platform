import { Loader } from 'lucide-react'

function RouteFallback() {
    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] flex items-center justify-center'>
            <Loader size={28} className='animate-spin text-emerald-500' />
        </div>
    )
}

export default RouteFallback
