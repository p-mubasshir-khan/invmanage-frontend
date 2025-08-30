import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_products: 0,
    low_stock_count: 0,
    recent_orders: []
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to generate sequential order ID (same as Orders component)
  const generateOrderId = (index) => {
    return String(index + 1).padStart(3, '0'); // 001, 002, 003, etc.
  };

  const fetchDashboardData = async () => {
    try {
      const dashboardUrl = `${getApiUrl()}/api/dashboard`;
      const lowStockUrl = `${getApiUrl()}/api/dashboard/low-stock`;

      const [dashboardResponse, lowStockResponse] = await Promise.all([
        axios.get(dashboardUrl),
        axios.get(lowStockUrl)
      ]);

      setDashboardData({
        total_products: dashboardResponse?.data?.total_products || 0,
        low_stock_count: dashboardResponse?.data?.low_stock_count || 0,
        recent_orders: Array.isArray(dashboardResponse?.data?.recent_orders)
          ? dashboardResponse.data.recent_orders
          : []
      });

      setLowStockProducts(
        Array.isArray(lowStockResponse?.data) ? lowStockResponse.data : []
      );
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '-';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalProducts = dashboardData?.total_products || 0;
  const lowStockCount = dashboardData?.low_stock_count || 0;
  const recentOrders = Array.isArray(dashboardData?.recent_orders)
    ? dashboardData.recent_orders
    : [];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{lowStockCount}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{recentOrders.length}</div>
          <div className="stat-label">Recent Orders</div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Low Stock Alerts */}
        <div className="card">
          <h2>Low Stock Alerts</h2>
          {Array.isArray(lowStockProducts) && lowStockProducts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Reorder Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product?.id || Math.random()}>
                    <td>{product?.name || '-'}</td>
                    <td className="low-stock">{product?.quantity ?? '-'}</td>
                    <td>{product?.reorder_threshold ?? '-'}</td>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Recent Orders</h2>
            <Link to="/orders" className="btn btn-outline" style={{ fontSize: '12px', textDecoration: 'none' }}>
              View All Orders →
            </Link>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '4px', 
            padding: '8px', 
            marginBottom: '12px',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            <strong>ℹ️  Note:</strong> Order IDs shown are display numbers for the 5 most recent orders. 
            For the complete order list with full details, visit the Orders page.
          </div>
          {recentOrders.length > 0 ? (
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
                {recentOrders.map((order, index) => (
                  <tr key={order?.id || Math.random()}>
                    <td>#{generateOrderId(index)}</td>
                    <td>{order?.product_name || '-'}</td>
                    <td>{order?.quantity ?? '-'}</td>
                    <td>₹{order?.total_amount?.toFixed(2) ?? '0.00'}</td>
                    <td>{formatDate(order?.created_at)}</td>
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
