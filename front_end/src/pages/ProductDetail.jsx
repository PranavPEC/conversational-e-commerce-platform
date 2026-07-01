import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { fetchProductById, addCartItem } from '../redux/reduxActions'

function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { selectedProduct: product, productLoading } = useSelector(state => state.products)
    const { userData } = useSelector(state => state.auth)

    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        fetchProductById(id)   // plain call
    }, [id])

    const handleAddToCart = async () => {
        if (!userData) {
            navigate('/login')
            return
        }

        setAdding(true)
        setFeedback(null)

        try {
            const result = await addCartItem({ productId: product._id, quantity })
            if (result.success) {
                setFeedback({ success: true, msg: 'Added to cart successfully!' })
            } else {
                setFeedback({ success: false, msg: result.message || 'Failed to add to cart.' })
            }
        } catch (err) {
            setFeedback({ success: false, msg: 'Something went wrong.' })
        } finally {
            setAdding(false)
            setTimeout(() => setFeedback(null), 3000)
        }
    }

    if (productLoading) {
        return (
            <div className='w-full min-h-screen bg-zinc-950 flex justify-center items-center'>
                <p className='text-zinc-400 text-sm'>Loading product...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className='w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center gap-4'>
                <p className='text-zinc-400 text-sm'>Product not found.</p>
                <button onClick={() => navigate('/products')} className='text-emerald-400 text-sm hover:text-emerald-300 transition-colors duration-200'>
                    Back to products
                </button>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-zinc-950 px-6 py-10'>

            <button
                onClick={() => navigate('/products')}
                className='text-zinc-400 text-sm hover:text-white transition-colors duration-200 mb-8 flex items-center gap-2'
            >
                ← Back to products
            </button>

            <div className='max-w-4xl mx-auto flex flex-col md:flex-row gap-10'>

                <div className='w-full md:w-[45%] bg-zinc-800 rounded-2xl overflow-hidden h-80 md:h-auto flex-shrink-0'>
                    {product.image ? (
                        <img src={product.image} alt={product.title} className='w-full h-full object-cover' />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-zinc-600 text-sm'>No Image</div>
                    )}
                </div>

                <div className='flex flex-col gap-5 flex-1'>

                    <div className='flex flex-col gap-2'>
                        <h1 className='text-white text-2xl font-semibold tracking-tight'>{product.title}</h1>
                        <p className='text-zinc-400 text-sm leading-relaxed'>{product.description}</p>
                    </div>

                    <span className='text-emerald-400 text-3xl font-bold'>₹{product.price.toLocaleString('en-IN')}</span>

                    {product.stock === 0 ? (
                        <span className='text-red-400 text-sm font-medium'>Out of stock</span>
                    ) : (
                        <span className='text-zinc-500 text-sm'>{product.stock} items in stock</span>
                    )}

                    <div className='h-px bg-zinc-800 w-full' />

                    {product.stock > 0 && (
                        <div className='flex items-center gap-4'>
                            <span className='text-zinc-400 text-sm'>Quantity</span>
                            <div className='flex items-center gap-3'>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center text-lg'>−</button>
                                <span className='text-white font-medium w-6 text-center'>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center text-lg'>+</button>
                            </div>
                        </div>
                    )}

                    {feedback && (
                        <p className={`text-sm font-medium ${feedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                            {feedback.msg}
                        </p>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || adding}
                        className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ProductDetail