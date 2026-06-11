import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dataContext } from '../context/userContext.jsx'

function ProductDetail() {
  const { id } = useParams()
  const { getProductById, addToCart } = useContext(dataContext)
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [feedback, setFeedback] = useState(null) // { success: true/false, msg: '' }

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id)
      if (data) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    setAdding(true)
    const result = await addToCart(product._id, quantity)
    setFeedback(result)
    setAdding(false)
    // Clear feedback message after 3 seconds
    setTimeout(() => setFeedback(null), 3000)
  }

  if (loading) {
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
        <button
          onClick={() => navigate('/products')}
          className='text-emerald-400 text-sm hover:text-emerald-300 transition-colors duration-200'
        >
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

        {/* Product Image */}
        <div className='w-full md:w-[45%] bg-zinc-800 rounded-2xl overflow-hidden h-80 md:h-auto flex-shrink-0'>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-zinc-600 text-sm'>
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='flex flex-col gap-5 flex-1'>

          <div className='flex flex-col gap-2'>
            <h1 className='text-white text-2xl font-semibold tracking-tight'>{product.title}</h1>
            <p className='text-zinc-400 text-sm leading-relaxed'>{product.description}</p>
          </div>

          <span className='text-emerald-400 text-3xl font-bold'>₹{product.price}</span>

          {product.stock === 0 ? (
            <span className='text-red-400 text-sm font-medium'>Out of stock</span>
          ) : (
            <span className='text-zinc-500 text-sm'>{product.stock} items in stock</span>
          )}

          <div className='h-px bg-zinc-800 w-full' />

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className='flex items-center gap-4'>
              <span className='text-zinc-400 text-sm'>Quantity</span>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center text-lg'
                >
                  −
                </button>
                <span className='text-white font-medium w-6 text-center'>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center text-lg'
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <p className={`text-sm font-medium ${feedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
              {feedback.msg}
            </p>
          )}

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className='w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200'
          >
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default ProductDetail;
