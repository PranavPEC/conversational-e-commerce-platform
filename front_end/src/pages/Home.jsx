import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  ShoppingBag, ArrowRight, Tag, Truck,
  Shield, Star, Package, ChevronRight
} from 'lucide-react'
import { fetchProducts } from '../features/products/productThunks.js'

function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userData } = useSelector((state) => state.auth)
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // First name only for greeting
  const firstName = userData?.name?.split(' ')[0] || 'there'

  // Show 4 featured products (first 4 from store)
  const featured = products.slice(0, 4)

  const perks = [
    { icon: Tag,    title: 'Exclusive deals',     desc: 'Members-only offers every week' },
    { icon: Truck,  title: 'Free delivery',        desc: 'On all orders, no minimum' },
    { icon: Shield, title: 'Secure checkout',      desc: '100% safe & encrypted' },
    { icon: Package, title: 'Easy returns',        desc: '7-day hassle-free return policy' },
  ]

  return (
    <div className='w-full min-h-screen bg-zinc-950'>

      {/* ── HERO ── */}
      <section
        className='relative w-full overflow-hidden flex flex-col justify-center px-6 md:px-16 py-20 md:py-28'
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1f1a 55%, #0a0f0a 100%)' }}
      >
        {/* Decorative blobs — same as Login/SignUp */}
        <div
          className='absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none'
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
        />
        <div
          className='absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none'
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
        />

        <div className='relative z-10 max-w-2xl'>
          {/* Eyebrow */}
          <div className='flex items-center gap-2 mb-5'>
            <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
            <span className='text-emerald-400 text-xs font-medium tracking-widest uppercase'>
              Welcome back
            </span>
          </div>

          {/* Heading */}
          <h1 className='text-white text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-3'>
            Hey, {firstName} 👋
          </h1>
          <h2 className='text-emerald-400 text-3xl md:text-5xl font-bold leading-tight mb-6'>
            ready to shop?
          </h2>

          <div className='w-16 h-1 bg-emerald-500 rounded-full mb-6' />

          <p className='text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mb-10'>
            Explore thousands of products handpicked just for you. From deals to doorstep — ShopAI has it all.
          </p>

          {/* CTAs */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={() => navigate('/products')}
              className='flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
              Browse Products
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className='flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border border-zinc-700 hover:border-emerald-500 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
            >
              <ShoppingBag size={15} />
              View Cart
            </button>
          </div>
        </div>
      </section>

      {/* ── PERKS BAR ── */}
      <section className='w-full bg-zinc-900 border-y border-zinc-800 px-6 md:px-16 py-8'>
        <div className='max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6'>
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className='flex items-start gap-3'>
              <div className='w-9 h-9 rounded-full border border-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <Icon size={15} className='text-emerald-400' />
              </div>
              <div>
                <p className='text-white text-sm font-medium'>{title}</p>
                <p className='text-zinc-500 text-xs mt-0.5'>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className='w-full px-6 md:px-16 py-14'>
        <div className='max-w-5xl mx-auto'>

          {/* Section header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>Handpicked for you</p>
              <h2 className='text-white text-2xl font-bold tracking-tight'>Featured Products</h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              className='flex items-center gap-1 text-zinc-400 hover:text-emerald-400 text-sm transition-colors duration-200 cursor-pointer'
            >
              See all
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'>
                  <div className='w-full h-44 bg-zinc-800 animate-pulse' />
                  <div className='p-4 flex flex-col gap-2'>
                    <div className='h-3 bg-zinc-800 rounded-full w-3/4 animate-pulse' />
                    <div className='h-3 bg-zinc-800 rounded-full w-1/2 animate-pulse' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products grid */}
          {!loading && featured.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {featured.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate('/product/' + product._id)}
                  className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors duration-200 flex flex-col'
                >
                  {/* Image */}
                  <div className='w-full h-44 overflow-hidden bg-zinc-800'>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-zinc-600 text-xs'>
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className='p-4 flex flex-col gap-1.5 flex-1'>
                    <h3 className='text-white text-sm font-medium leading-tight line-clamp-2'>
                      {product.title}
                    </h3>
                    <div className='mt-auto pt-2 flex items-center justify-between'>
                      <span className='text-emerald-400 font-semibold text-sm'>₹{product.price}</span>
                      {product.stock === 0 ? (
                        <span className='text-xs text-red-400'>Out of stock</span>
                      ) : (
                        <span className='text-xs text-zinc-500'>{product.stock} left</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && featured.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 gap-3'>
              <ShoppingBag size={32} className='text-zinc-700' />
              <p className='text-zinc-400 text-sm'>No products available right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── SOCIAL PROOF BANNER ── */}
      <section className='w-full px-6 md:px-16 pb-16'>
        <div className='max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6'>

          {/* Avatar stack + stars */}
          <div className='flex items-center gap-4'>
            <div className='flex -space-x-2'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='w-9 h-9 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs text-white font-medium'
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className='w-9 h-9 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-950 font-bold'>
                +2K
              </div>
            </div>
            <div>
              <p className='text-white text-sm font-medium'>2,000+ happy customers</p>
              <div className='flex items-center gap-0.5 mt-1'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className='text-emerald-400 fill-emerald-400' />
                ))}
                <span className='text-zinc-500 text-xs ml-1.5'>5.0 average rating</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/products')}
            className='flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap'
          >
            Shop Now
            <ArrowRight size={15} />
          </button>

        </div>
      </section>

    </div>
  )
}

export default Home
