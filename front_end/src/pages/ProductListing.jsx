import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { fetchProducts } from '../redux/reduxActions'

const CATEGORY_LABELS = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  home: 'Home',
  beauty: 'Beauty',
  accessories: 'Accessories',
  audio: 'Audio',
  laptops: 'Laptops',
  premium: 'Premium',
  uncategorized: 'Uncategorized',
}

function ProductListing() {
  const navigate = useNavigate()
  const location = useLocation()

  const { products, productsLoading } = useSelector(state => state.products)

  useEffect(() => {
    fetchProducts()   // plain call — no dispatch()
  }, [])

  const categoryParam = new URLSearchParams(location.search).get('category')
  const normalizedCategory = categoryParam ? categoryParam.toLowerCase() : null

  const visibleProducts = normalizedCategory
    ? products.filter(product => (product.category || 'uncategorized').toLowerCase() === normalizedCategory)
    : products

  const heading = normalizedCategory
    ? (CATEGORY_LABELS[normalizedCategory] || normalizedCategory)
    : 'All Products'

  if (productsLoading) {
    return (
      <div className='w-full min-h-screen bg-[var(--color-bg)] flex justify-center items-center'>
        <p className='text-zinc-400 text-sm'>Loading products...</p>
      </div>
    )
  }

  if (visibleProducts.length === 0) {
    return (
      <div className='w-full min-h-screen bg-[var(--color-bg)] flex justify-center items-center'>
        <p className='text-zinc-400 text-sm'>
          {normalizedCategory
            ? 'No products found in this category.'
            : 'No products found.'}
        </p>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-[var(--color-bg)] px-6 py-10'>

      <h1 className='text-white text-2xl font-semibold tracking-tight mb-8'>
        {heading}
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {visibleProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate('/product/' + product._id)}
            className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors duration-200 flex flex-col'
          >
            <div className='w-full h-48 overflow-hidden bg-zinc-800'>
              {product.image ? (
                <img src={product.image} alt={product.title} className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-zinc-600 text-sm'>
                  No Image
                </div>
              )}
            </div>

            <div className='p-4 flex flex-col gap-2 flex-1'>
              <h2 className='text-white text-sm font-medium leading-tight'>{product.title}</h2>
              <p className='text-zinc-400 text-xs line-clamp-2'>{product.description}</p>

              <div className='mt-auto pt-3 flex items-center justify-between'>
                <span className='text-emerald-400 font-semibold text-sm'>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.stock === 0 ? (
                  <span className='text-xs text-red-400 font-medium'>Out of stock</span>
                ) : (
                  <span className='text-xs text-zinc-500'>{product.stock} left</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ProductListing
