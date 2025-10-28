import { useState } from 'react'

function ProductDetailModal({ product, cartItems, onClose, onAddToCart, onUpdateQuantity, onRemoveFromCart }) {
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

  const handleRemoveFromCart = async () => {
    if (cartItem) {
      await onRemoveFromCart(cartItem.id)
    }
  }

  const isInStock = product.stock > 0

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} />
            {!isInStock && <span className="out-of-stock-large">Out of Stock</span>}
          </div>
          
          <div className="product-detail-info">
            <h2>{product.name}</h2>
            <p className="product-detail-price">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="product-detail-stock">
              <span className={isInStock ? 'in-stock' : 'out-stock'}>
                {isInStock ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
              </span>
            </div>
            
            <div className="product-detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {isInCart && (
              <div className="product-detail-cart-status">
                <span 
                  className="cart-status-badge clickable" 
                  onClick={handleRemoveFromCart}
                  title="Click to remove from cart"
                >
                  ✓ Added to Cart ({cartQuantity})
                </span>
              </div>
            )}
            
            {isInStock && (
              <div className="product-detail-actions">
                {isInCart ? (
                  <div className="added-to-cart-detail">
                    <button
                      onClick={handleIncreaseQuantity}
                      disabled={cartItem && cartItem.quantity >= product.stock}
                      className="increase-quantity-btn-detail"
                    >
                      + Add More to Cart
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="add-to-cart-btn-detail"
                  >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailModal

