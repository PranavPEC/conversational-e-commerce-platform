
import { ShoppingBag, Tag, Truck, Shield, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import navigationStrings from '../../constants/navigationStrings/navigationStrings.js'

// Static panel â€” no props, no logic
// Same markup for Login and SignUp left panels
// SignUp has different headline text so it gets its own SignUpLeftPanel

const features = [
    { icon: Tag,    title: 'Exclusive offers',  desc: 'Access special deals' },
    { icon: Truck,  title: 'Fast delivery',      desc: 'Quick & reliable shipping' },
    { icon: Shield, title: 'Secure payments',    desc: '100% safe & secure' },
]

function LoginLeftPanel() {
    const navigate=useNavigate();
    return (
        <div
            className='theme-lock-dark hidden lg:flex lg:w-[45%] bg-zinc-950 relative overflow-hidden flex-col justify-between p-10'
        >
            {/* Logo */}
            <div className='flex items-center gap-2 z-10' onClick={() => navigate(navigationStrings.HOME)}>
                <div className='w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center cursor-pointer'>
                    <ShoppingBag size={18} className='text-zinc-950' />
                </div>
                <span className='text-white font-semibold text-lg tracking-tight cursor-pointer'>ShopAI</span>
            </div>

            {/* Center content */}
            <div className='z-10 flex flex-col gap-8'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-white text-5xl font-bold leading-tight tracking-tight'>
                        Welcome<br />back
                    </h1>
                    <h2 className='text-emerald-400 text-4xl font-bold leading-tight'>
                        good to see you
                    </h2>
                    <div className='w-16 h-1 bg-emerald-500 rounded-full' />
                    <p className='text-zinc-400 text-sm leading-relaxed max-w-xs'>
                        Log back in to ShopAI and pick up right where you left off. Your cart is waiting.
                    </p>
                </div>

                {/* Feature list */}
                <div className='flex flex-col gap-4'>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full border border-emerald-500 flex items-center justify-center flex-shrink-0'>
                                <Icon size={16} className='text-emerald-400' />
                            </div>
                            <div>
                                <p className='text-white text-sm font-medium'>{title}</p>
                                <p className='text-zinc-500 text-xs'>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social proof */}
            <div className='z-10 bg-zinc-900 bg-opacity-60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4'>
                <div className='flex -space-x-2'>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className='w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs text-white font-medium'>
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    <div className='w-8 h-8 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-950 font-bold'>
                        +2K
                    </div>
                </div>
                <div>
                    <p className='text-white text-sm font-medium'>Join 2K+ happy customers</p>
                    <div className='flex items-center gap-0.5 mt-0.5'>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={11} className='text-emerald-400 fill-emerald-400' />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginLeftPanel
