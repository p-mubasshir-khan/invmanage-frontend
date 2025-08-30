import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config';
import './AIInsights.css';

const AIInsights = () => {
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/api/ai-insights`);
      setInsights(response?.data || {});
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc3545';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case 'Out of Stock': return '#dc3545';
      case 'Critical Stock': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading AI insights...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const sales = insights?.sales_analysis || {};
  const stockRecs = Array.isArray(insights?.stock_recommendations) ? insights.stock_recommendations : [];
  const trending = Array.isArray(insights?.trending_products) ? insights.trending_products : [];
  const alerts = Array.isArray(insights?.risk_alerts) ? insights.risk_alerts : [];
  const tips = Array.isArray(insights?.optimization_tips) ? insights.optimization_tips : [];

  return (
    <div className="ai-insights">
      <h1 className="page-title">🤖 AI Insights & Recommendations</h1>
      
      {/* Sales Analysis */}
      {sales && Object.keys(sales).length > 0 && (
        <div className="card">
          <h2>📊 Sales Analysis</h2>
          <div className="sales-stats">
            <div className="stat-item">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{sales?.total_orders ?? '-'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{(sales?.total_revenue ?? 0).toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Order Value</span>
              <span className="stat-value">₹{(sales?.average_order_value ?? 0).toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Analysis Period</span>
              <span className="stat-value">{sales?.period ?? '-'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stock Recommendations */}
      {stockRecs.length > 0 && (
        <div className="card">
          <h2>📦 Stock Recommendations</h2>
          <div className="recommendations-grid">
            {stockRecs.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <h3>{rec?.product_name ?? '-'}</h3>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(rec?.priority) }}
                  >
                    {rec?.priority ?? '-'}
                  </span>
                </div>
                <div className="recommendation-details">
                  <p><strong>Current Stock:</strong> {rec?.current_stock ?? '-'}</p>
                  <p><strong>Recommended Stock:</strong> {rec?.recommended_stock ?? '-'}</p>
                  <p><strong>Reason:</strong> {rec?.reason ?? '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Products */}
      {trending.length > 0 && (
        <div className="card">
          <h2>🔥 Trending Products</h2>
          <div className="trending-grid">
            {trending.map((product, index) => (
              <div key={index} className="trending-card">
                <h3>{product?.product_name ?? '-'}</h3>
                <p><strong>Total Ordered:</strong> {product?.total_ordered ?? 0} units</p>
                <p><strong>Current Stock:</strong> {product?.current_stock ?? 0} units</p>
                <div className="trend-indicator">
                  <span className="trend-icon">📈</span>
                  <span>High demand product</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Alerts */}
      {alerts.length > 0 && (
        <div className="card">
          <h2>⚠️ Risk Alerts</h2>
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div key={index} className="alert-item">
                <div className="alert-header">
                  <span 
                    className="alert-type"
                    style={{ backgroundColor: getAlertTypeColor(alert?.type) }}
                  >
                    {alert?.type ?? '-'}
                  </span>
                  <span className="alert-product">{alert?.product_name ?? '-'}</span>
                </div>
                <p className="alert-message">{alert?.message ?? '-'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Tips */}
      {tips.length > 0 && (
        <div className="card">
          <h2>💡 Optimization Tips</h2>
          <div className="tips-list">
            {tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <div className="tip-content">
                  <p><strong>💡 {tip?.tip ?? '-'}</strong></p>
                  <p className="tip-impact"><strong>Impact:</strong> {tip?.impact ?? '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Insights Message */}
      {stockRecs.length === 0 && trending.length === 0 && alerts.length === 0 && tips.length === 0 && (
        <div className="card">
          <div className="no-insights">
            <h2>🤖 No AI Insights Available</h2>
            <p>Create some orders to generate intelligent recommendations and insights!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
