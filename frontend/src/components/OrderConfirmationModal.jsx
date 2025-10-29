function OrderConfirmationModal({ orderNumber, total, itemCount, onClose }) {
  return (
    <>
      <div className="order-modal-overlay" onClick={onClose}></div>
      <div className="order-modal-content">
        <div className="order-success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <div className="order-details">
          <div className="order-detail-item">
            <span className="order-label">Order Number:</span>
            <span className="order-value">{orderNumber}</span>
          </div>
          <div className="order-detail-item">
            <span className="order-label">Total Items:</span>
            <span className="order-value">{itemCount}</span>
          </div>
          <div className="order-detail-item">
            <span className="order-label">Total Amount:</span>
            <span className="order-value order-total">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <p className="order-message">Thank you for your purchase! 🎉</p>
        <button onClick={onClose} className="order-close-btn">Continue Shopping</button>
      </div>
    </>
  )
}

export default OrderConfirmationModal


