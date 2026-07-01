import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    setAdminProducts,
    clearAdminStatus,
} from '../../redux/reduxActions'

import AdminHeader from './AdminHeader.jsx'
import AdminToast from './AdminToast.jsx'
import ProductForm from './ProductForm.jsx'
import ProductTable from './ProductTable.jsx'
import DeleteModal from './DeleteModal.jsx'
import { buildFormData } from '../../utils/CommonFunctions.js'

const EMPTY_FORM = { title: '', description: '', price: '', stock: '' }

function Admin() {
    // New state keys from adminReducers — adminLoading/adminError/adminSuccess
    const { products, adminLoading, adminError, adminSuccess } = useSelector(state => state.admin)
    const { products: publicProducts } = useSelector(state => state.products)

    const [form, setForm] = useState(EMPTY_FORM)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        fetchProducts()   // plain call
    }, [])

    useEffect(() => {
        if (publicProducts.length > 0) {
            setAdminProducts(publicProducts)   // plain call — dispatches internally
        }
    }, [publicProducts])

    useEffect(() => {
        if (adminSuccess || adminError) {
            const t = setTimeout(() => clearAdminStatus(), 3000)
            return () => clearTimeout(t)
        }
    }, [adminSuccess, adminError])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

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

    const handleResetForm = () => {
        setEditingProduct(null)
        setForm(EMPTY_FORM)
        setImageFile(null)
        setImagePreview(null)
        setShowForm(false)
    }

    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.price || !form.stock) return
        const formData = buildFormData(form, imageFile)

        if (editingProduct) {
            await updateProduct({ id: editingProduct._id, formData })   // plain call
        } else {
            await createProduct(formData)   // plain call
        }
        handleResetForm()
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        await deleteProduct(deleteTarget._id)   // plain call
        setDeleteTarget(null)
    }

    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8'>

                <AdminHeader onAddClick={() => { handleResetForm(); setShowForm(true) }} />

                <AdminToast success={adminSuccess} error={adminError} />

                {showForm && (
                    <ProductForm
                        form={form}
                        setForm={setForm}
                        imagePreview={imagePreview}
                        handleImageChange={handleImageChange}
                        handleSubmit={handleSubmit}
                        handleResetForm={handleResetForm}
                        editingProduct={editingProduct}
                        loading={adminLoading}
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
                loading={adminLoading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}

export default Admin