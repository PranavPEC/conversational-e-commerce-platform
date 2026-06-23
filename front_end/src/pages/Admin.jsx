import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2, X, AlertCircle, CheckCircle, Loader, Package } from 'lucide-react'
import { createProduct, updateProduct, deleteProduct } from '../features/admin/adminThunks.js'
import { clearAdminStatus, setAdminProducts } from '../features/admin/adminSlice.js'
import { fetchProducts } from '../features/products/productThunks.js'
import { buildFormData } from '../utils/CommonFunctions.js'


// ── Empty form state — reused for both reset and initial state ──
const EMPTY_FORM = { title: '', description: '', price: '', stock: '' }

function Admin() {
    const dispatch = useDispatch()

    // Admin state — loading, error, success, products list
    const { products, loading, error, success } = useSelector(state => state.admin)

    // Pull products from the public productsSlice to avoid a duplicate API call
    const { products: publicProducts } = useSelector(state => state.products)

    // ── Local state ──
    const [form, setForm] = useState(EMPTY_FORM)
    const [imageFile, setImageFile] = useState(null)        // actual File object
    const [imagePreview, setImagePreview] = useState(null)  // local blob URL for preview
    const [editingProduct, setEditingProduct] = useState(null)  // product being edited, null = create mode
    const [deleteTarget, setDeleteTarget] = useState(null)  // product pending delete confirmation
    const [showForm, setShowForm] = useState(false)         // toggle create/edit form panel

    // ── On mount: fetch products and copy into adminSlice ──
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    // Sync public products into adminSlice whenever they change
    useEffect(() => {
        if (publicProducts.length > 0) {
            dispatch(setAdminProducts(publicProducts))
        }
    }, [publicProducts])

    // ── Auto-clear success/error after 3 seconds ──
    useEffect(() => {
        if (success || error) {
            const t = setTimeout(() => dispatch(clearAdminStatus()), 3000)
            return () => clearTimeout(t)
        }
    }, [success, error])

    // ── Handle image file pick — show local preview immediately ──
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        // createObjectURL makes a temporary local URL so the user sees the image
        // without waiting for a Cloudinary upload
        setImagePreview(URL.createObjectURL(file))
    }

    // ── Open form in Edit mode — pre-fill with existing product data ──
    const handleEdit = (product) => {
        setEditingProduct(product)
        setForm({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
        })
        setImageFile(null)
        setImagePreview(product.image || null)  // show existing image as preview
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ── Reset form to Create mode ──
    const handleResetForm = () => {
        setEditingProduct(null)
        setForm(EMPTY_FORM)
        setImageFile(null)
        setImagePreview(null)
        setShowForm(false)
    }

    // ── Submit — create or update depending on editingProduct ──
    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.price || !form.stock) return

        // Build FormData — required because we're sending a file + text together
        const formData = buildFormData(form,imageFile);

        if (editingProduct) {
            await dispatch(updateProduct({ id: editingProduct._id, formData }))
        } else {
            await dispatch(createProduct(formData))
        }

        handleResetForm()
    }

    // ── Delete confirmed ──
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        await dispatch(deleteProduct(deleteTarget._id))
        setDeleteTarget(null)
    }

    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8'>

                {/* ── Page Header ── */}
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-emerald-400 text-xs font-medium tracking-widest uppercase mb-1'>
                            Admin
                        </p>
                        <h1 className='text-white text-2xl font-bold tracking-tight'>
                            Product Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={() => { handleResetForm(); setShowForm(true) }}
                        className='flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>

                {/* ── Toast — success or error ── */}
                {(success || error) && (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                        success
                            ? 'bg-emerald-500 bg-opacity-10 border-emerald-500 border-opacity-30 text-emerald-400'
                            : 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-30 text-red-400'
                    }`}>
                        {success
                            ? <CheckCircle size={15} className='flex-shrink-0' />
                            : <AlertCircle size={15} className='flex-shrink-0' />
                        }
                        {success || error}
                    </div>
                )}

                {/* ── Create / Edit Form ── */}
                {showForm && (
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

                        {/* Submit button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !form.title || !form.description || !form.price || !form.stock}
                            className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
                        >
                            {loading ? (
                                <><Loader size={16} className='animate-spin' /> Processing...</>
                            ) : (
                                editingProduct ? 'Update Product' : 'Create Product'
                            )}
                        </button>

                    </div>
                )}

                {/* ── Products Table ── */}
                <div className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'>

                    {/* Table header */}
                    <div className='px-5 py-4 border-b border-zinc-800 flex items-center justify-between'>
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
                                    <img src={product.image} alt={product.title} className='w-full h-full object-cover' />
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

                            {/* Price */}
                            <div className='text-right flex-shrink-0 hidden sm:block'>
                                <p className='text-emerald-400 text-sm font-semibold'>₹{product.price}</p>
                                <p className='text-zinc-500 text-xs'>{product.stock} in stock</p>
                            </div>

                            {/* Actions */}
                            <div className='flex items-center gap-2 flex-shrink-0'>
                                <button
                                    onClick={() => handleEdit(product)}
                                    className='w-8 h-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer'
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(product)}
                                    className='w-8 h-8 rounded-lg bg-zinc-700 hover:bg-red-500 flex items-center justify-center text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer'
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* ── Delete Confirmation Modal ── */}
            {deleteTarget && (
                <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4'>
                    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5'>

                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 flex items-center justify-center flex-shrink-0'>
                                <Trash2 size={16} className='text-red-400' />
                            </div>
                            <div>
                                <h3 className='text-white font-semibold'>Delete Product</h3>
                                <p className='text-zinc-400 text-sm'>This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className='text-zinc-300 text-sm'>
                            Are you sure you want to delete{' '}
                            <span className='text-white font-medium'>"{deleteTarget.title}"</span>?
                        </p>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className='flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={loading}
                                className='flex-1 h-11 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer'
                            >
                                {loading ? <Loader size={14} className='animate-spin' /> : 'Delete'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Admin
