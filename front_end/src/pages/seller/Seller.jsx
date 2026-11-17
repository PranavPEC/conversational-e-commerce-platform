import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    createProduct,
    updateProduct,
    deleteProduct,
    fetchMyProducts,
    clearSellerStatus,
} from '../../redux/reduxActions'
import { useTranslation } from 'react-i18next'
import SellerHeader from './SellerHeader.jsx'
import SellerToast from './SellerToast.jsx'
import ProductForm from './ProductForm.jsx'
import ProductTable from './ProductTable.jsx'
import DeleteModal from '../../components/common_components/DeleteModal.jsx'
import { buildFormData } from '../../utils/CommonFunctions.js'

// category is now an array of strings — default to empty array, not empty string
const EMPTY_FORM = { title: '', description: '', price: '', stock: '', category: [] }

function Seller() {
    const { t } = useTranslation('seller')
    const { products, sellerLoading, sellerError, sellerSuccess } = useSelector(state => state.seller)

    const [form, setForm] = useState(EMPTY_FORM)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showForm, setShowForm] = useState(false)

    // Fetch only this seller's products on mount — server-side filtered, no other seller's data
    useEffect(() => {
        fetchMyProducts().catch(() => {})
    }, [])

    useEffect(() => {
        if (sellerSuccess || sellerError) {
            const timer = setTimeout(() => clearSellerStatus(), 3000)
            return () => clearTimeout(timer)
        }
    }, [sellerSuccess, sellerError])

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
            // product.category is an array after migration; fall back gracefully
            // if somehow it's still a string (pre-migration legacy document)
            category: Array.isArray(product.category)
                ? product.category
                : [product.category || 'uncategorized'],
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
        if (!form.title || !form.description || !form.price || !form.stock || form.category.length === 0) return

        // buildFormData does formData.append(key, value) for each field.
        // Appending a JS array directly would coerce it to "val1,val2" string.
        // JSON.stringify here so the controller can JSON.parse it back to an array.
        const serializedForm = { ...form, category: JSON.stringify(form.category) }
        const formData = buildFormData(serializedForm, imageFile)

        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct._id, formData })   // plain call
            } else {
                await createProduct(formData)   // plain call
            }
            handleResetForm()
        } catch {
            // Intentionally ignored here — sellerError is already surfaced via SellerToast.
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        try {
            await deleteProduct(deleteTarget._id)   // plain call
            setDeleteTarget(null)
        } catch {
            // Intentionally ignored here — sellerError is already surfaced via SellerToast.
        }
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8'>

                <SellerHeader onAddClick={() => { handleResetForm(); setShowForm(true) }} />

                <SellerToast success={sellerSuccess} error={sellerError} />

                {showForm && (
                    <ProductForm
                        form={form}
                        setForm={setForm}
                        imagePreview={imagePreview}
                        handleImageChange={handleImageChange}
                        handleSubmit={handleSubmit}
                        handleResetForm={handleResetForm}
                        editingProduct={editingProduct}
                        loading={sellerLoading}
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
                loading={sellerLoading}
                title={t('delete_product')}
                itemName={deleteTarget?.title}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}

export default Seller
