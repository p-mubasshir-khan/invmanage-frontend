import React, { useState, useEffect } from 'react';
import './OrderForm.css';

const OrderForm = ({ products, customers, onSubmit, onClose, isLoading = false }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    customer_id: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const next = { ...formData };
    if (products.length > 0) {
      next.product_id = products[0].id;
      setSelectedProduct(products[0]);
    }
    if (customers && customers.length > 0) {
      next.customer_id = customers[0].id;
    }
    if (next.product_id || next.customer_id) setFormData(next);
  }, [products, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'product_id' || name === 'customer_id') {
      parsedValue = value; // Keep as string for MongoDB ObjectId
    } else if (name === 'quantity') {
      parsedValue = parseInt(value) || 1;
    }
    setFormData({
      ...formData,
      [name]: parsedValue
    });

    if (name === 'product_id') {
      const product = products.find(p => p.id === value);
      setSelectedProduct(product);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getMaxQuantity = () => {
    return selectedProduct ? selectedProduct.quantity : 0;
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create New Order</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product_id">Product</label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price.toFixed(2)} (Stock: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="customer_id">Customer</label>
            <select
              id="customer_id"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
            >
              {customers && customers.length > 0 ? (
                customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value="">No customers found</option>
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={getMaxQuantity()}
              required
            />
            <small className="form-text">
              Available stock: {getMaxQuantity()}
            </small>
          </div>
          
          {selectedProduct && (
            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><strong>Product:</strong> {selectedProduct.name}</p>
              <p><strong>Price per unit:</strong> ₹{selectedProduct.price.toFixed(2)}</p>
              <p><strong>Quantity:</strong> {formData.quantity}</p>
              {formData.customer_id && (
                <p><strong>Customer:</strong> {customers?.find(c => c.id === formData.customer_id)?.name}</p>
              )}
              <p><strong>Total Amount:</strong> ₹{(selectedProduct.price * formData.quantity).toFixed(2)}</p>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={formData.quantity > getMaxQuantity() || isLoading}
            >
              {isLoading ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
