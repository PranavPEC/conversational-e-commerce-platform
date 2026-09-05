// No props — purely visual skeleton, same pattern as OrdersLoading

function WishlistLoading() {
    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>
            <div className='max-w-3xl mx-auto'>
                <div className='h-7 w-40 bg-zinc-800 rounded-full animate-pulse mb-8' />
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'>
                            <div className='w-full h-32 bg-zinc-800 animate-pulse' />
                            <div className='p-3 flex flex-col gap-2'>
                                <div className='h-3 w-full bg-zinc-800 rounded-full animate-pulse' />
                                <div className='h-3 w-16 bg-zinc-800 rounded-full animate-pulse' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WishlistLoading