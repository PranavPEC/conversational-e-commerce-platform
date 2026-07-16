import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'
import PrimaryButton from '../../components/common_components/PrimaryButton'

const getTimeLeftToMidnight = () => {
    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 0)

    const diff = Math.max(0, nextMidnight.getTime() - now.getTime())

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0')
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')

    return { hours, minutes, seconds }
}

function DealBanner() {
    const navigate = useNavigate()
    const [ref, isVisible] = useScrollReveal()
    const [timeLeft, setTimeLeft] = useState(getTimeLeftToMidnight)

    useEffect(() => {
        // Client-side placeholder countdown for UI only.
        // Real timed promotions should come from backend promotion windows.
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeftToMidnight())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section
            ref={ref}
            className={`w-full px-6 md:px-16 py-4 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <div className='max-w-5xl mx-auto bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-4 md:p-5'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>

                    <div className='flex flex-col gap-3'>
                        <p className='inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold tracking-widest uppercase'>
                            <Zap size={14} />
                            Deal of the Day
                        </p>

                        <h3 className='text-white text-sm md:text-base font-semibold'>
                            Up to 40% off Electronics
                        </h3>

                        <div className='flex items-center gap-2'>
                            <div className='bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 min-w-[52px] text-center'>
                                <p className='text-white text-sm font-bold'>{timeLeft.hours}</p>
                                <p className='text-zinc-500 text-[10px] mt-0.5'>HH</p>
                            </div>
                            <div className='bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 min-w-[52px] text-center'>
                                <p className='text-white text-sm font-bold'>{timeLeft.minutes}</p>
                                <p className='text-zinc-500 text-[10px] mt-0.5'>MM</p>
                            </div>
                            <div className='bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 min-w-[52px] text-center'>
                                <p className='text-white text-sm font-bold'>{timeLeft.seconds}</p>
                                <p className='text-zinc-500 text-[10px] mt-0.5'>SS</p>
                            </div>
                        </div>
                    </div>

                    <PrimaryButton
                        text='Shop Deals'
                        onClick={() => navigate('/products')}
                        className='w-full lg:w-auto'
                    />
                </div>
            </div>
        </section>
    )
}

export default DealBanner
