import { useState } from 'react'

function ProductCard({ product, cartItems, onAddToCart, onUpdateQuantity }) {
  const [isAdding, setIsAdding] = useState(false)

  const cartItem = cartItems.find(item => item.productId === product.id)
  const isInCart = !!cartItem
  const cartQuantity = cartItem?.quantity || 0

  const handleAddToCart = async () => {
    setIsAdding(true)
    await onAddToCart(product.id, 1)
    setIsAdding(false)
  }

  const handleIncreaseQuantity = async () => {
    if (cartItem && cartItem.quantity < product.stock) {
      await onUpdateQuantity(cartItem.id, cartItem.quantity + 1)
    }
  }

  const isInStock = product.stock > 0

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
        {!isInStock && <span className="out-of-stock">Out of Stock</span>}
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-pricing">
            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="stock">Stock: {product.stock}</span>
          </div>
          
          {isInStock && (
            <div className="product-actions">
              {isInCart ? (
                <div className="added-to-cart">
                  <span className="added-status">✓ Added to Cart ({cartQuantity})</span>
                  {cartItem && cartItem.quantity < product.stock && (
                    <button
                      onClick={handleIncreaseQuantity}
                      className="increase-quantity-btn"
                    >
                      + Increase Quantity
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="add-to-cart-btn"
                >
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard

