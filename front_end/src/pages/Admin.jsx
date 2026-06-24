import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, updateProduct, deleteProduct } from '../features/admin/adminThunks.js'
import { clearAdminStatus, setAdminProducts } from '../features/admin/adminSlice.js'
import { fetchProducts } from '../features/products/productThunks.js'

// ── Admin components ──
import AdminHeader from '../components/admin/AdminHeader.jsx'
import AdminToast from '../components/admin/AdminToast.jsx'
import ProductForm from '../components/admin/ProductForm.jsx'
import ProductTable from '../components/admin/ProductTable.jsx'
import DeleteModal from '../components/admin/DeleteModal.jsx'

// ── Common Functions ──
import { buildFormData } from '../utils/CommonFunctions.js'

const EMPTY_FORM = { title: '', description: '', price: '', stock: '' }

function Admin() {
    const dispatch = useDispatch()

    const { products, loading, error, success } = useSelector(state => state.admin)
    const { products: publicProducts } = useSelector(state => state.products)

    // ── Local state ──
    const [form, setForm] = useState(EMPTY_FORM)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showForm, setShowForm] = useState(false)

    // ── Fetch products on mount ──
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    // ── Sync public products into adminSlice ──
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

    // ── Image pick handler ──
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    // ── Open form in Edit mode ──
    const handleEdit = (product) => {
        setEditingProduct(product)
        setForm({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
        })
        setImageFile(null)
        setImagePreview(product.image || null)
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ── Reset to Create mode ──
    const handleResetForm = () => {
        setEditingProduct(null)
        setForm(EMPTY_FORM)
        setImageFile(null)
        setImagePreview(null)
        setShowForm(false)
    }

    // ── Submit — create or update ──
    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.price || !form.stock) return

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

                <AdminHeader
                    onAddClick={() => { handleResetForm(); setShowForm(true) }}
                />

                <AdminToast
                    success={success}
                    error={error}
                />

                {showForm && (
                    <ProductForm
                        form={form}
                        setForm={setForm}
                        imagePreview={imagePreview}
                        handleImageChange={handleImageChange}
                        handleSubmit={handleSubmit}
                        handleResetForm={handleResetForm}
                        editingProduct={editingProduct}
                        loading={loading}
                    />
                )}

                <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDeleteClick={setDeleteTarget}
                />

            </div>

            <DeleteModal
                deleteTarget={deleteTarget}
                loading={loading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}

export default Admin
