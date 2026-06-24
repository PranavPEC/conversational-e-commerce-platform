import React from 'react'
import { Pencil, Trash2, Package } from 'lucide-react'

// Props:
//   products      — array of product objects from adminSlice
//   onEdit        — called with product object when Edit is clicked (Admin.jsx pre-fills form)
//   onDeleteClick — called with product object when Delete is clicked (Admin.jsx sets deleteTarget)

function ProductTable({ products, onEdit, onDeleteClick }) {
    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'>

            {/* Table header */}
            <div className='px-5 py-4 border-b border-zinc-800'>
                <h2 className='text-white font-semibold'>
                    All Products
                    <span className='text-zinc-500 text-sm font-normal ml-2'>
                        ({products.length})
                    </span>
                </h2>
            </div>

            {/* Empty state */}
            {products.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 gap-3'>
                    <Package size={32} className='text-zinc-700' />
                    <p className='text-zinc-400 text-sm'>No products yet. Add your first one.</p>
                </div>
            )}

            {/* Product rows */}
            {products.map(product => (
                <div
                    key={product._id}
                    className='flex items-center gap-4 px-5 py-4 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800 transition-colors duration-150'
                >
                    {/* Image */}
                    <div className='w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700'>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.title}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                                <Package size={16} className='text-zinc-600' />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                        <p className='text-white text-sm font-medium truncate'>{product.title}</p>
                        <p className='text-zinc-500 text-xs mt-0.5 truncate'>{product.description}</p>
                    </div>

                    {/* Price + stock */}
                    <div className='text-right flex-shrink-0 hidden sm:block'>
                        <p className='text-emerald-400 text-sm font-semibold'>₹{product.price}</p>
                        <p className='text-zinc-500 text-xs'>{product.stock} in stock</p>
                    </div>

                    {/* Action buttons */}
                    <div className='flex items-center gap-2 flex-shrink-0'>
                        <button
                            onClick={() => onEdit(product)}
                            className='w-8 h-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer'
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => onDeleteClick(product)}
                            className='w-8 h-8 rounded-lg bg-zinc-700 hover:bg-red-500 flex items-center justify-center text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer'
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default ProductTable
