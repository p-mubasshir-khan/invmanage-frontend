import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config';
import ProductForm from './ProductForm';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/api/products`);
      setProducts(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product || null);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${getApiUrl()}/api/products/${productId}`);
        setProducts(products?.filter(p => p?.id !== productId) || []);
        setMessage('Product deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage('Error deleting product');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleFormSubmit = async (productData) => {
    if (!productData) return;
    try {
      if (editingProduct?.id) {
        const response = await axios.put(
          `${getApiUrl()}/api/products/${editingProduct.id}`,
          productData
        );
        setProducts(products?.map(p => (p?.id === editingProduct.id ? response?.data : p)) || []);
        setMessage('Product updated successfully');
      } else {
        const response = await axios.post(`${getApiUrl()}/api/products`, productData);
        setProducts([...(products || []), response?.data]);
        setMessage('Product added successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage('Error saving product');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products">
      <div className="products-header">
        <h1 className="page-title">Products</h1>
        <button onClick={handleAddProduct} className="btn btn-primary">
          Add Product
        </button>
      </div>

      {message && (
        <div className={`alert ${message?.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Reorder Threshold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(products) ? products : []).map(product => (
              <tr key={product?._id}>
                <td>{product?.name || '-'}</td>
                <td className={product?.quantity < product?.reorderThreshold ? 'low-stock' : ''}>
                  {product?.quantity ?? '-'}
                </td>
                <td>₹{product?.price ? product.price.toFixed(2) : '-'}</td>
                <td>{product?.reorderThreshold ?? '-'}</td>
                <td>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product?._id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: '8px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct || null}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Products;
