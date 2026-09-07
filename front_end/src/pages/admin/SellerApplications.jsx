import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Mail, User, CalendarDays, ChevronDown, FileText } from 'lucide-react'
import { fetchSellerApplications, updateSellerApplicationStatus } from '../../redux/reduxActions'
import { formatDate } from '../../utils/CommonFunctions.js'
import AdminHeader from './AdminHeader.jsx'

function DocumentRow({ label, value }) {
    return (
        <div className='flex items-center justify-between gap-4'>
            <span className='text-zinc-500'>{label}</span>
            <span className='text-zinc-300 text-right break-all'>{value || '-'}</span>
        </div>
    )
}

function DocumentLink({ label, href, viewLabel }) {
    return (
        <div className='flex items-center justify-between gap-4'>
            <span className='text-zinc-500'>{label}</span>
            {href ? (
                <a
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    className='text-emerald-400 hover:text-emerald-300 transition-colors duration-200'
                >
                    {viewLabel}
                </a>
            ) : (
                <span className='text-zinc-500'>-</span>
            )}
        </div>
    )
}

function SellerApplications() {
    const { t } = useTranslation('admin')
    const { sellerApplications, sellerApplicationsLoading, sellerApplicationsError } = useSelector(state => state.admin)
    const [expandedSellerId, setExpandedSellerId] = useState(null)

    useEffect(() => {
        fetchSellerApplications().catch(() => {
            // Intentionally ignored here — sellerApplicationsError is already surfaced below.
        })
    }, [])

    const handleStatusChange = async (sellerId, status) => {
        try {
            await updateSellerApplicationStatus(sellerId, status)
        } catch {
            // Intentionally ignored here — sellerApplicationsError is already surfaced below.
        }
    }

    const renderActions = (seller) => {
        if (seller.sellerStatus === 'pending') {
            const hasDocuments = !!seller.sellerDocuments?.submittedAt
            return (
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => handleStatusChange(seller._id, 'approved')}
                        disabled={!hasDocuments}
                        className={`text-xs border px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                            hasDocuments
                                ? 'text-emerald-400 hover:text-emerald-300 border-emerald-400 border-opacity-40 hover:border-opacity-70 cursor-pointer'
                                : 'text-zinc-600 border-zinc-700 cursor-not-allowed'
                        }`}
                    >
                        {t('approve')}
                    </button>
                    <button
                        onClick={() => handleStatusChange(seller._id, 'rejected')}
                        className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                    >
                        {t('reject')}
                    </button>
                </div>
            )
        }

        if (seller.sellerStatus === 'approved') {
            return (
                <button
                    onClick={() => handleStatusChange(seller._id, 'rejected')}
                    className='text-xs text-red-400 hover:text-red-300 border border-red-400 border-opacity-40 hover:border-opacity-70 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer'
                >
                    {t('reject')}
                </button>
            )
        }

        if (seller.sellerStatus === 'rejected') {
            const hasDocuments = !!seller.sellerDocuments?.submittedAt
            return (
                <button
                    onClick={() => handleStatusChange(seller._id, 'approved')}
                    disabled={!hasDocuments}
                    className={`text-xs border px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                        hasDocuments
                            ? 'text-emerald-400 hover:text-emerald-300 border-emerald-400 border-opacity-40 hover:border-opacity-70 cursor-pointer'
                            : 'text-zinc-600 border-zinc-700 cursor-not-allowed'
                    }`}
                >
                    {t('approve')}
                </button>
            )
        }

        return null
    }

    const renderContent = () => {
        if (sellerApplicationsLoading) {
            return (
                <div className='flex flex-col gap-4'>
                    {[1, 2, 3].map(i => (
                        <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-28 animate-pulse' />
                    ))}
                </div>
            )
        }

        if (sellerApplicationsError) {
            return (
                <div className='flex flex-col items-center justify-center gap-3 py-16'>
                    <p className='text-red-400 text-sm'>{sellerApplicationsError}</p>
                    <button
                        onClick={() => fetchSellerApplications()}
                        className='px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {t('retry')}
                    </button>
                </div>
            )
        }

        if (sellerApplications.length === 0) {
            return (
                <div className='flex flex-col items-center justify-center gap-2 py-16'>
                    <p className='text-zinc-400 text-sm'>{t('no_seller_applications')}</p>
                </div>
            )
        }

        return (
            <div className='flex flex-col gap-4'>
                {sellerApplications.map(seller => {
                    const isExpanded = expandedSellerId === seller._id
                    const documents = seller.sellerDocuments
                    const hasDocuments = !!documents?.submittedAt

                    return (
                        <div key={seller._id} className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4'>
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex flex-col gap-2 min-w-0'>
                                    <div className='flex items-center gap-2 text-white font-semibold'>
                                        <User size={15} className='text-zinc-500 flex-shrink-0' />
                                        <span className='truncate'>{seller.name}</span>
                                    </div>
                                    <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500 text-xs'>
                                        <span className='inline-flex items-center gap-1.5'>
                                            <Mail size={13} />
                                            {seller.email}
                                        </span>
                                        <span className='inline-flex items-center gap-1.5'>
                                            <CalendarDays size={13} />
                                            {seller.createdAt ? formatDate(seller.createdAt) : t('date_not_available')}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-wrap items-center justify-between md:justify-end gap-3 flex-shrink-0'>
                                    <p className='text-zinc-400 text-sm'>{t(seller.sellerStatus)}</p>
                                    <button
                                        onClick={() => setExpandedSellerId(isExpanded ? null : seller._id)}
                                        className='inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer'
                                    >
                                        <FileText size={14} />
                                        {isExpanded ? t('hide_documents') : t('view_documents')}
                                        <ChevronDown size={14} className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                    </button>
                                    {renderActions(seller)}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className='border-t border-zinc-800 pt-4 flex flex-col gap-3 text-sm'>
                                    {!hasDocuments ? (
                                        <p className='text-zinc-500'>{t('no_documents_submitted')}</p>
                                    ) : (
                                        <>
                                            <DocumentRow label={t('aadhar_number')} value={documents.aadharNumber} />
                                            <DocumentRow label={t('pan_number')} value={documents.panNumber} />
                                            <DocumentRow label={t('gstin_number')} value={documents.gstin || t('not_provided')} />
                                            <DocumentRow
                                                label={t('submitted_on')}
                                                value={documents.submittedAt ? formatDate(documents.submittedAt) : t('date_not_available')}
                                            />
                                            <DocumentLink label={t('aadhar_number')} href={documents.aadharImage} viewLabel={t('view_file')} />
                                            <DocumentLink label={t('pan_number')} href={documents.panImage} viewLabel={t('view_file')} />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-7xl mx-auto flex flex-col gap-8'>
                <AdminHeader title={t('seller_applications')} />
                {renderContent()}
            </div>
        </div>
    )
}

export default SellerApplications
