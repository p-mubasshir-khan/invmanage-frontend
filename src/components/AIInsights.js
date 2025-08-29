import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIInsights.css';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ai-insights`);
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
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

  if (loading) {
    return <div className="loading">Loading AI insights...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="ai-insights">
      <h1 className="page-title">🤖 AI Insights & Recommendations</h1>
      
      {/* Sales Analysis */}
      {insights.sales_analysis && Object.keys(insights.sales_analysis).length > 0 && (
        <div className="card">
          <h2>📊 Sales Analysis</h2>
          <div className="sales-stats">
            <div className="stat-item">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{insights.sales_analysis.total_orders}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{insights.sales_analysis.total_revenue.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Order Value</span>
              <span className="stat-value">₹{insights.sales_analysis.average_order_value.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Analysis Period</span>
              <span className="stat-value">{insights.sales_analysis.period}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stock Recommendations */}
      {insights.stock_recommendations.length > 0 && (
        <div className="card">
          <h2>📦 Stock Recommendations</h2>
          <div className="recommendations-grid">
            {insights.stock_recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <h3>{rec.product_name}</h3>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(rec.priority) }}
                  >
                    {rec.priority}
                  </span>
                </div>
                <div className="recommendation-details">
                  <p><strong>Current Stock:</strong> {rec.current_stock}</p>
                  <p><strong>Recommended Stock:</strong> {rec.recommended_stock}</p>
                  <p><strong>Reason:</strong> {rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Products */}
      {insights.trending_products.length > 0 && (
        <div className="card">
          <h2>🔥 Trending Products</h2>
          <div className="trending-grid">
            {insights.trending_products.map((product, index) => (
              <div key={index} className="trending-card">
                <h3>{product.product_name}</h3>
                <p><strong>Total Ordered:</strong> {product.total_ordered} units</p>
                <p><strong>Current Stock:</strong> {product.current_stock} units</p>
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
      {insights.risk_alerts.length > 0 && (
        <div className="card">
          <h2>⚠️ Risk Alerts</h2>
          <div className="alerts-list">
            {insights.risk_alerts.map((alert, index) => (
              <div key={index} className="alert-item">
                <div className="alert-header">
                  <span 
                    className="alert-type"
                    style={{ backgroundColor: getAlertTypeColor(alert.type) }}
                  >
                    {alert.type}
                  </span>
                  <span className="alert-product">{alert.product_name}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Tips */}
      {insights.optimization_tips.length > 0 && (
        <div className="card">
          <h2>💡 Optimization Tips</h2>
          <div className="tips-list">
            {insights.optimization_tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <div className="tip-content">
                  <p><strong>💡 {tip.tip}</strong></p>
                  <p className="tip-impact"><strong>Impact:</strong> {tip.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Insights Message */}
      {(!insights.stock_recommendations.length && 
        !insights.trending_products.length && 
        !insights.risk_alerts.length && 
        !insights.optimization_tips.length) && (
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
