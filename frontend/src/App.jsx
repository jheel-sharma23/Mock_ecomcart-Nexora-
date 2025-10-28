import { useState, useEffect } from 'react'
import './App.css'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import Toast from './components/Toast'

const API_URL = '/api'

function App() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 85000 })

  // Fetch products
  useEffect(() => {
    fetchProducts()
    fetchCart()
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        setCartItems(cartData)
      } catch (err) {
        console.error('Error loading cart from localStorage:', err)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } else {
      localStorage.removeItem('cart')
    }
  }, [cartItems])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`)
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      setCartItems(data)
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add to cart')
      }
      await fetchCart()
      showToast(`Added to cart!`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const updateCartItem = async (cartId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update cart')
      }
      await fetchCart()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const removeFromCart = async (cartId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to remove from cart')
      await fetchCart()
      showToast('Item removed from cart', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const clearCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to clear cart')
      await fetchCart()
      showToast('Cart cleared', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const filteredProducts = products
    .filter(product =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      product.price >= priceRange.min &&
      product.price <= priceRange.max
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (loading) return <div className="loading">Loading products...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-brand">
            <span className="logo">🛒</span>
            <h1>TechShop</h1>
          </div>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            🛍️ Cart ({getTotalItems()})
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="products-header">
            <h2>Products</h2>
            <div className="controls-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <span className="results-count">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <div className="filter-container">
              <label>Price Range:</label>
              <input 
                type="range" 
                min="0" 
                max="85000" 
                step="5000"
                value={priceRange.max} 
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="price-range"
              />
              <span className="price-range-value">Max: ₹{priceRange.max.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-results">
                <p>No products found matching "{searchTerm}"</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartItems={cartItems}
                  onAddToCart={addToCart}
                  onUpdateQuantity={updateCartItem}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartItem}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App
