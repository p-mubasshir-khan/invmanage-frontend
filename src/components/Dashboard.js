import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_products: 0,
    low_stock_count: 0,
    recent_orders: []
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, lowStockResponse] = await Promise.all([
        axios.get('/api/dashboard'),
        axios.get('/api/dashboard/low-stock')
      ]);

      setDashboardData(dashboardResponse.data);
      setLowStockProducts(lowStockResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{dashboardData.total_products}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.low_stock_count}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.recent_orders.length}</div>
          <div className="stat-label">Recent Orders</div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Low Stock Alerts */}
        <div className="card">
          <h2>Low Stock Alerts</h2>
          {lowStockProducts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Reorder Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td className="low-stock">{product.quantity}</td>
                    <td>{product.reorder_threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No low stock items at the moment.</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h2>Recent Orders</h2>
          {dashboardData.recent_orders.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.total_amount.toFixed(2)}</td>
                    <td>{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
