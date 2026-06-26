import React from 'react'
import { ShoppingBag, ChevronRight } from 'lucide-react'

// Handles all three states: loading skeleton, product grid, empty state
// Props:
//   featured        — array of up to 4 products (sliced in Home.jsx)
//   loading         — boolean from productsSlice
//   onProductClick  — navigate to /product/:id (called with product._id)
//   onSeeAll        — navigate to /products

function FeaturedProducts({ featured, loading, onProductClick, onSeeAll }) {
    return (
        <section className='w-full px-6 md:px-16 py-14'>
            <div className='max-w-5xl mx-auto'>

                {/* Section header */}
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                            Handpicked for you
                        </p>
                        <h2 className='text-white text-2xl font-bold tracking-tight'>
                            Featured Products
                        </h2>
                    </div>
                    <button
                        onClick={onSeeAll}
                        className='flex items-center gap-1 text-zinc-400 hover:text-emerald-400 text-sm transition-colors duration-200 cursor-pointer'
                    >
                        See all
                        <ChevronRight size={15} />
                    </button>
                </div>

                {/* Loading skeleton — 4 pulse cards */}
                {loading && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {[1, 2, 3, 4].map(i => (
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

                {/* Product grid */}
                {!loading && featured.length > 0 && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {featured.map(product => (
                            <div
                                key={product._id}
                                onClick={() => onProductClick(product._id)}
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
                                        <span className='text-emerald-400 font-semibold text-sm'>
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </span>
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
    )
}

export default FeaturedProducts
