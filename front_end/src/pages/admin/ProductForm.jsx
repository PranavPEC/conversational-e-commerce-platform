import React from 'react'
import { X, Loader } from 'lucide-react'

// Used for both Create and Edit modes
// editingProduct === null  → Create mode
// editingProduct !== null  → Edit mode (form pre-filled by Admin.jsx)
//
// Props:
//   form, setForm          — controlled form state (title, description, price, stock)
//   imagePreview           — blob URL or existing Cloudinary URL for preview
//   handleImageChange      — file input onChange handler (defined in Admin.jsx)
//   handleSubmit           — dispatches createProduct or updateProduct
//   handleResetForm        — closes form and resets all state
//   editingProduct         — null in create mode, product object in edit mode
//   loading                — disables submit button during API call

function ProductForm({
    form,
    setForm,
    imagePreview,
    handleImageChange,
    handleSubmit,
    handleResetForm,
    editingProduct,
    loading
}) {
    const isFormValid = form.title && form.description && form.price && form.stock

    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5'>

            {/* Form header */}
            <div className='flex items-center justify-between'>
                <h2 className='text-white text-lg font-semibold'>
                    {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button
                    onClick={handleResetForm}
                    className='text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer'
                >
                    <X size={18} />
                </button>
            </div>

            {/* Fields grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                {/* Title */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-zinc-300 text-sm font-medium'>Title</label>
                    <input
                        type='text'
                        placeholder='Product title'
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        className='w-full h-11 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                    />
                </div>

                {/* Price */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-zinc-300 text-sm font-medium'>Price (₹)</label>
                    <input
                        type='number'
                        placeholder='0'
                        min='0'
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        className='w-full h-11 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                    />
                </div>

                {/* Stock */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-zinc-300 text-sm font-medium'>Stock</label>
                    <input
                        type='number'
                        placeholder='0'
                        min='0'
                        value={form.stock}
                        onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                        className='w-full h-11 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                    />
                </div>

                {/* Image upload */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-zinc-300 text-sm font-medium'>Image</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='w-full h-11 bg-zinc-800 text-zinc-400 border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-white file:text-xs cursor-pointer'
                    />
                </div>

                {/* Description — full width */}
                <div className='flex flex-col gap-1.5 md:col-span-2'>
                    <label className='text-zinc-300 text-sm font-medium'>Description</label>
                    <textarea
                        placeholder='Product description'
                        rows={3}
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        className='w-full bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm transition-colors duration-200 resize-none'
                    />
                </div>

            </div>

            {/* Image preview */}
            {imagePreview && (
                <div className='flex items-center gap-4'>
                    <img
                        src={imagePreview}
                        alt='Preview'
                        className='w-20 h-20 rounded-xl object-cover border border-zinc-700'
                    />
                    <p className='text-zinc-500 text-xs'>Image preview</p>
                </div>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
                className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
            >
                {loading ? (
                    <><Loader size={16} className='animate-spin' /> Processing...</>
                ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                )}
            </button>

        </div>
    )
}

export default ProductForm
