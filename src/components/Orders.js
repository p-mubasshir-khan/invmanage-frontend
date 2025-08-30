import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config';
import OrderForm from './OrderForm';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to generate sequential order ID
  const generateOrderId = (index) => {
    return String(index + 1).padStart(3, '0'); // 001, 002, 003, etc.
  };

  // Test function to debug order creation
  const testOrderCreation = async () => {
    const testData = {
      product_id: products[0]?.id,
      quantity: 1,
      customer_id: customers[0]?.id
    };
    console.log('Testing order creation with:', testData);
    try {
      const response = await axios.post(`${getApiUrl()}/api/orders`, testData);
      console.log('Test order created:', response.data);
      setMessage('Test order created successfully');
      setTimeout(() => setMessage(''), 3000);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Test order failed:', error);
      setMessage('Test order failed: ' + (error?.response?.data?.error || error.message));
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const fetchData = async () => {
    try {
      const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
        axios.get(`${getApiUrl()}/api/orders`),
        axios.get(`${getApiUrl()}/api/products`),
        axios.get(`${getApiUrl()}/api/customers`)
      ]);

      setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
      setProducts(Array.isArray(productsResponse?.data) ? productsResponse.data : []);
      setCustomers(Array.isArray(customersResponse?.data) ? customersResponse.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = () => setShowForm(true);

  const handleFormSubmit = async (orderData) => {
    if (!orderData) return;
    
    // Validate order data before submission
    console.log('Validating order data:', orderData);
    if (!orderData.product_id) {
      setMessage('Product is required');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!orderData.quantity || orderData.quantity <= 0) {
      setMessage('Valid quantity is required');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setCreatingOrder(true); // Start loading
    
    try {
      console.log('Submitting order data:', orderData); // Debug: See what's being sent
      const response = await axios.post(`${getApiUrl()}/api/orders`, orderData);
      console.log('Order created successfully:', response.data); // Debug: See response
      
      // Close form first
      setShowForm(false);
      
      // Show success message
      setMessage('Order created successfully! Refreshing orders list...');
      
      // Refresh the orders list to get the latest data
      await fetchData();
      
      // Update success message
      setMessage('Order created successfully!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error response:', error?.response?.data); // Debug: See full error details
      
      // Check if it's a network error or server error
      if (error.response) {
        // Server responded with error status
        setMessage(error.response.data?.error || 'Server error creating order');
      } else if (error.request) {
        // Network error
        setMessage('Network error. Please check your connection.');
      } else {
        // Other error
        setMessage('Error creating order. Please try again.');
      }
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setCreatingOrder(false); // Stop loading
    }
  };

  const handleFormClose = () => setShowForm(false);

  const handleDeleteOrder = async (orderId) => {
    if (!orderId) return;
    
    // Show confirmation dialog explaining the behavior
    const confirmed = window.confirm(
      'Are you sure you want to delete this order?\n\n' +
      '⚠️  IMPORTANT: Deleting this order will NOT restore the product quantity to inventory.\n' +
      'The products were already physically given to the customer.\n\n' +
      'This action will only remove the order record from the system.'
    );
    
    if (!confirmed) return;
    
    try {
      await axios.delete(`${getApiUrl()}/api/orders/${orderId}`);

      // Remove the order from the local state
      setOrders((orders || []).filter(o => o?.id !== orderId));

      // IMPORTANT: Do NOT restore product quantity when deleting orders
      // This would create phantom inventory since the products were already physically given to the customer
      // The order deletion should only remove the order record, not affect inventory levels

      setMessage('Order deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting order:', error);
      setMessage('Error deleting order');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '-';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders">
      <div className="orders-header">
        <h1 className="page-title">Orders</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCreateOrder} className="btn btn-primary">
            Create Order
          </button>
          <button onClick={fetchData} className="btn btn-outline">
            Refresh
          </button>
          <button 
            onClick={testOrderCreation} 
            className="btn btn-outline"
            style={{ fontSize: '12px' }}
            disabled={!products.length || !customers.length}
          >
            Test Order
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message?.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px', 
          padding: '12px', 
          marginBottom: '16px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <strong>ℹ️  Important Note:</strong> Deleting an order will only remove the order record from the system. 
          It will <strong>NOT</strong> restore the product quantity to inventory since the products were already 
          physically given to the customer. This prevents phantom inventory and maintains accurate stock levels.
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(orders) ? orders : []).map((order, index) => (
              <tr key={order?.id || Math.random()}>
                <td>#{generateOrderId(index)}</td>
                <td>{order?.product_name ?? '-'}</td>
                <td>{order?.quantity ?? '-'}</td>
                <td>₹{order?.total_amount?.toFixed(2) ?? '-'}</td>
                <td>{formatDate(order?.created_at)}</td>
                <td>{order?.customer_name ?? '-'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteOrder(order?.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(Array.isArray(orders) ? orders : []).length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No orders found. Create your first order!
          </p>
        )}
      </div>

      {showForm && (
        <OrderForm
          products={products || []}
          customers={customers || []}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          isLoading={creatingOrder}
        />
      )}
    </div>
  );
};

export default Orders;
