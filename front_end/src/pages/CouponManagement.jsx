import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Loader, Tag, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
    createCoupon,
    deleteCoupon,
    fetchMyCoupons,
    toggleCouponStatus,
} from '../redux/reduxActions/couponActions.js'

const EMPTY_FORM = {
    code: '',
    discountPercent: '',
    maxDiscountAmount: '',
    minCartValue: '',
    expiryDate: '',
    usageLimit: '',
}

function CouponManagement({ adminView = false }) {
    const { t, i18n } = useTranslation('coupon')
    const { coupons, couponLoading, couponError, couponSuccess } = useSelector(state => state.coupons)
    const [form, setForm] = useState(EMPTY_FORM)

    useEffect(() => {
        fetchMyCoupons().catch(() => {
            // The request error is rendered from coupon management state below.
        })
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const payload = {
            code: form.code.trim().toUpperCase(),
            discountPercent: Number(form.discountPercent),
        }
        if (form.maxDiscountAmount !== '') payload.maxDiscountAmount = Number(form.maxDiscountAmount)
        if (form.minCartValue !== '') payload.minCartValue = Number(form.minCartValue)
        if (form.expiryDate) payload.expiryDate = form.expiryDate
        if (form.usageLimit !== '') payload.usageLimit = Number(form.usageLimit)

        try {
            await createCoupon(payload)
            setForm(EMPTY_FORM)
        } catch {
            // The request error is rendered from coupon management state below.
        }
    }

    const handleToggleStatus = async (coupon) => {
        try {
            await toggleCouponStatus({ id: coupon._id, isActive: !coupon.isActive })
        } catch {
            // The request error is rendered from coupon management state below.
        }
    }

    const handleDelete = async (coupon) => {
        if (!window.confirm(t('delete_confirm'))) return
        try {
            await deleteCoupon(coupon._id)
        } catch {
            // The request error is rendered from coupon management state below.
        }
    }

    const fields = [
        { name: 'code', type: 'text', label: 'code_label', placeholder: 'code_placeholder', required: true },
        { name: 'discountPercent', type: 'number', label: 'discount_percent_label', min: 1, max: 100, required: true },
        { name: 'maxDiscountAmount', type: 'number', label: 'max_discount_label', min: 0 },
        { name: 'minCartValue', type: 'number', label: 'min_cart_value_label', min: 0 },
        { name: 'expiryDate', type: 'date', label: 'expiry_date_label' },
        { name: 'usageLimit', type: 'number', label: 'usage_limit_label', min: 1 },
    ]

    return (
        <div className='flex flex-col gap-6'>
            <form onSubmit={handleSubmit} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5'>
                <h2 className='text-white text-lg font-semibold'>{t('form_title')}</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {fields.map(field => (
                        <div key={field.name} className='flex flex-col gap-1.5'>
                            <label htmlFor={`coupon-${field.name}`} className='text-zinc-300 text-sm font-medium'>
                                {t(field.label)}
                            </label>
                            <input
                                id={`coupon-${field.name}`}
                                type={field.type}
                                value={form[field.name]}
                                onChange={event => setForm(current => ({ ...current, [field.name]: event.target.value }))}
                                placeholder={field.placeholder ? t(field.placeholder) : undefined}
                                min={field.min}
                                max={field.max}
                                required={field.required}
                                disabled={couponLoading}
                                className='w-full h-11 bg-zinc-800 text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 text-sm transition-colors duration-200 disabled:opacity-60'
                            />
                        </div>
                    ))}
                </div>
                <button
                    type='submit'
                    disabled={couponLoading}
                    className='self-start flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                    {couponLoading ? <><Loader size={15} className='animate-spin' />{t('creating')}</> : t('create_coupon')}
                </button>
                {couponError && <p role='alert' className='text-red-400 text-sm'>{couponError}</p>}
                {couponSuccess && <p role='status' className='text-emerald-400 text-sm'>{t(couponSuccess)}</p>}
            </form>

            <section className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-zinc-800'>
                    <h2 className='text-white font-semibold'>
                        {t(adminView ? 'table_title_admin' : 'table_title')}
                        <span className='text-zinc-500 text-sm font-normal ml-2'>({coupons.length})</span>
                    </h2>
                </div>

                {couponLoading && coupons.length === 0 ? (
                    <div className='flex justify-center py-12'><Loader size={20} className='text-emerald-400 animate-spin' /></div>
                ) : coupons.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-16 gap-3'>
                        <Tag size={32} className='text-zinc-700' />
                        <p className='text-zinc-400 text-sm'>{t('no_coupons_yet')}</p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left'>
                            <thead className='text-zinc-500 text-xs uppercase tracking-wide'>
                                <tr>
                                    <th className='px-5 py-3 font-medium'>{t('table_code')}</th>
                                    <th className='px-5 py-3 font-medium'>{t('table_discount')}</th>
                                    <th className='px-5 py-3 font-medium'>{t('table_usage')}</th>
                                    <th className='px-5 py-3 font-medium'>{t('table_expiry')}</th>
                                    <th className='px-5 py-3 font-medium'>{t('table_status')}</th>
                                    <th className='px-5 py-3 font-medium'>{t('table_actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(coupon => (
                                    <tr key={coupon._id} className='border-t border-zinc-800 text-sm'>
                                        <td className='px-5 py-4 text-white font-medium'>{coupon.code}</td>
                                        <td className='px-5 py-4 text-emerald-400'>{coupon.discountPercent}%</td>
                                        <td className='px-5 py-4 text-zinc-300'>
                                            {coupon.usedCount}/{coupon.usageLimit ?? t('unlimited')}
                                        </td>
                                        <td className='px-5 py-4 text-zinc-300'>
                                            {coupon.expiryDate
                                                ? new Date(coupon.expiryDate).toLocaleDateString(i18n.language)
                                                : t('no_expiry')}
                                        </td>
                                        <td className='px-5 py-4'>
                                            <span className={coupon.isActive
                                                ? 'text-emerald-400'
                                                : 'text-zinc-500'
                                            }>
                                                {coupon.isActive ? t('active') : t('inactive')}
                                            </span>
                                        </td>
                                        <td className='px-5 py-4'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    type='button'
                                                    onClick={() => handleToggleStatus(coupon)}
                                                    disabled={couponLoading}
                                                    className='px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs disabled:opacity-50 cursor-pointer'
                                                >
                                                    {coupon.isActive ? t('deactivate') : t('activate')}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => handleDelete(coupon)}
                                                    disabled={couponLoading}
                                                    aria-label={`${t('delete_coupon')} ${coupon.code}`}
                                                    className='w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-500 flex items-center justify-center text-zinc-300 hover:text-white transition-colors duration-200 disabled:opacity-50 cursor-pointer'
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}

export default CouponManagement
