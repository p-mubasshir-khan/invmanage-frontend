import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderForm from './OrderForm';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/orders`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/products`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/customers`)
      ]);
      setOrders(ordersResponse.data);
      setProducts(productsResponse.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (orderData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderData);
      setOrders([response.data, ...orders]);
      
      // Update product quantity in the products list
      const updatedProducts = products.map(product => {
        if (product.id === orderData.product_id) {
          return { ...product, quantity: product.quantity - orderData.quantity };
        }
        return product;
      });
      setProducts(updatedProducts);
      
      setShowForm(false);
      setMessage('Order created successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage(error.response?.data?.error || 'Error creating order');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`);
      // Remove order locally
      const deleted = orders.find(o => o.id === orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      // Restore product stock locally
      if (deleted) {
        setProducts(products.map(p => p.id === deleted.product_id ? { ...p, quantity: p.quantity + deleted.quantity } : p));
      }
      setMessage('Order deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting order:', error);
      setMessage('Error deleting order');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders">
      <div className="orders-header">
        <h1 className="page-title">Orders</h1>
        <button onClick={handleCreateOrder} className="btn btn-primary">
          Create Order
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
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
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>₹{order.total_amount.toFixed(2)}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{order.customer_name || '-'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No orders found. Create your first order!
          </p>
        )}
      </div>

      {showForm && (
        <OrderForm
          products={products}
          customers={customers}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Orders;
