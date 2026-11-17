import { X } from 'lucide-react'
import PrimaryButton from '../../components/common_components/PrimaryButton.jsx'
import { useTranslation } from 'react-i18next'

const CATEGORY_OPTIONS = [
    { value: 'electronics', label: 'electronics' },
    { value: 'fashion', label: 'fashion' },
    { value: 'home', label: 'home' },
    { value: 'beauty', label: 'beauty' },
    { value: 'accessories', label: 'accessories' },
    { value: 'audio', label: 'audio' },
    { value: 'laptops', label: 'laptops' },
    { value: 'premium', label: 'premium' },
    { value: 'uncategorized', label: 'uncategorized' },
]

// Used for both Create and Edit modes
// editingProduct === null  → Create mode
// editingProduct !== null  → Edit mode (form pre-filled by Seller.jsx)
//
// Props:
//   form, setForm          — controlled form state (title, description, price, stock, category[])
//   imagePreview           — blob URL or existing Cloudinary URL for preview
//   handleImageChange      — file input onChange handler (defined in Seller.jsx)
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
    // category is now an array — valid if at least one item is checked
    const isFormValid = form.title && form.description && form.price && form.stock && form.category.length > 0
    const { t } = useTranslation('seller')
    const toggleCategory = (value) => {
        setForm(f => {
            const already = f.category.includes(value)
            return {
                ...f,
                category: already
                    ? f.category.filter(c => c !== value)   // uncheck: remove
                    : [...f.category, value],               // check: add
            }
        })
    }

    return (
        <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5'>

            {/* Form header */}
            <div className='flex items-center justify-between'>
                <h2 className='text-white text-lg font-semibold'>
                    {editingProduct ? t('edit_product') : t('create_new_product')}
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
                    <label className='text-zinc-300 text-sm font-medium'>{t('title')}</label>
                    <input
                        type='text'
                        placeholder={t('product_title_placeholder')}
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        className='w-full h-11 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200'
                    />
                </div>

                {/* Price */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-zinc-300 text-sm font-medium'>{t('price')}</label>
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
                    <label className='text-zinc-300 text-sm font-medium'>{t('stock')}</label>
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
                    <label className='text-zinc-300 text-sm font-medium'>{t('image')}</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='w-full h-11 bg-zinc-800 text-zinc-400 border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-white file:text-xs cursor-pointer'
                    />
                </div>

                {/* Description — full width */}
                <div className='flex flex-col gap-1.5 md:col-span-2'>
                    <label className='text-zinc-300 text-sm font-medium'>{t('description')}</label>
                    <textarea
                        placeholder={t('product_description_placeholder')}
                        rows={3}
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        className='w-full bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm transition-colors duration-200 resize-none'
                    />
                </div>

                {/* Categories — checkbox group, full width */}
                <div className='flex flex-col gap-3 md:col-span-2'>
                    <label className='text-zinc-300 text-sm font-medium'>
                        {t('categories')}
                        <span className='text-zinc-500 font-normal ml-1.5'>({t('select_one_or_more')})</span>
                    </label>
                    <div className='flex flex-wrap gap-2'>
                        {CATEGORY_OPTIONS.map(option => {
                            const checked = form.category.includes(option.value)
                            return (
                                <button
                                    key={option.value}
                                    type='button'
                                    onClick={() => toggleCategory(option.value)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                                        checked
                                            ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-400'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {checked && <span className='mr-1'>✓</span>}
                                    {t(option.label)}
                                </button>
                            )
                        })}
                    </div>
                    {form.category.length === 0 && (
                        <p className='text-zinc-500 text-xs'>{t('at_least_one_category_required')}</p>
                    )}
                </div>

            </div>

            {/* Image preview */}
            {imagePreview && (
                <div className='flex items-center gap-4'>
                    <img
                        src={imagePreview}
                        alt={t('preview')}
                        className='w-20 h-20 rounded-xl object-cover border border-zinc-700'
                    />
                    <p className='text-zinc-500 text-xs'>{t('image_preview')}</p>
                </div>
            )}

            {/* Submit */}
            <PrimaryButton
                text={editingProduct ? t('update_product') : t('create_product')}
                onClick={handleSubmit}
                loading={loading}
                disabled={!isFormValid}
                LoadingText={t('processing')}
                className='w-full h-12'
            />

        </div>
    )
}

export default ProductForm

