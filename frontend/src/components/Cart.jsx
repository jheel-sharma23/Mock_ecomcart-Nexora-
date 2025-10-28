import { useState } from 'react'

function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onPlaceOrder }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    await onUpdateQuantity(cartId, newQuantity)
    setIsUpdating(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isUpdating}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="cart-quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating || item.quantity >= item.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <p>Total ({getTotalItems()} items):</p>
                <p className="total-price">₹{getTotal().toLocaleString('en-IN')}</p>
              </div>
              <button 
                onClick={onClearCart} 
                className="clear-cart-btn"
                style={{ marginBottom: '0.75rem' }}
              >
                Clear Cart
              </button>
              <button 
                onClick={() => {
                  const orderNumber = 'ORD-' + Date.now()
                  const total = getTotal()
                  const itemCount = getTotalItems()
                  onPlaceOrder(orderNumber, total, itemCount)
                }}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Cart

