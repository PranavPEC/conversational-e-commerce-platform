export const StatCard = ({ icon: Icon, label, value }) => (
    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4'>
        <div className='w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0'>
            <Icon size={20} />
        </div>
        <div className='min-w-0'>
            <p className='text-zinc-500 text-xs font-medium uppercase tracking-wide'>{label}</p>
            <p className='text-white text-xl font-bold mt-1 truncate'>{value}</p>
        </div>
    </div>
)

export const ChartCard = ({ title, children }) => (
    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5 min-h-[20rem]'>
        <h2 className='text-white font-semibold mb-5'>{title}</h2>
        <div className='h-64'>
            {children}
        </div>
    </div>
)

export const RankedList = ({ title, items, renderName, renderMeta, emptyLabel }) => (
    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-5'>
        <h2 className='text-white font-semibold mb-5'>{title}</h2>
        {items.length === 0 ? (
            <p className='text-zinc-500 text-sm'>{emptyLabel}</p>
        ) : (
            <div className='flex flex-col divide-y divide-zinc-800'>
                {items.map((item, index) => (
                    <div key={item.sellerId || item.productId || index} className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
                        <div className='flex items-center gap-3 min-w-0'>
                            <span className='w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-semibold flex items-center justify-center flex-shrink-0'>
                                {index + 1}
                            </span>
                            <p className='text-white text-sm font-medium truncate'>{renderName(item)}</p>
                        </div>
                        <p className='text-emerald-400 text-sm font-semibold flex-shrink-0'>{renderMeta(item)}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
)
