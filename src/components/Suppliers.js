import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config';
import SupplierForm from './SupplierForm';
import './Suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/api/suppliers`);
      setSuppliers(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setMessage('Error loading suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier || null);
    setShowForm(true);
  };

 const handleDeleteSupplier = async (supplierId) => {
  if (!supplierId) return;
  if (window.confirm('Are you sure you want to delete this supplier?')) {
    try {
      await axios.delete(`${getApiUrl()}/api/suppliers/${supplierId}`);
      setSuppliers((suppliers || []).filter(s => s?._id !== supplierId));
      setMessage('Supplier deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setMessage('Error deleting supplier');
      setTimeout(() => setMessage(''), 3000);
    }
  }
};


  const handleFormSubmit = async (supplierData) => {
    if (!supplierData) return;
    try {
      if (editingSupplier?.id) {
        const response = await axios.put(
          `${getApiUrl()}/api/suppliers/${editingSupplier.id}`,
          supplierData
        );
        setSuppliers((suppliers || []).map(s => (s?.id === editingSupplier.id ? response?.data : s)));
        setMessage('Supplier updated successfully');
      } else {
        const response = await axios.post(`${getApiUrl()}/api/suppliers`, supplierData);
        setSuppliers([...(suppliers || []), response?.data]);
        setMessage('Supplier added successfully');
      }
      setShowForm(false);
      setEditingSupplier(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving supplier:', error);
      setMessage('Error saving supplier');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return <div className="loading">Loading suppliers...</div>;
  }

  return (
    <div className="suppliers">
      <div className="suppliers-header">
        <h1 className="page-title">Suppliers</h1>
        <button onClick={handleAddSupplier} className="btn btn-primary">
          Add Supplier
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
              <th>Contact</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(suppliers) ? suppliers : []).map(supplier => (
              <tr key={supplier?._id || Math.random()}>
                <td>{supplier?.name ?? '-'}</td>
                <td>{supplier?.contact ?? '-'}</td>
                <td>{supplier?.address ?? '-'}</td>
                <td>
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier?._id)}
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
        <SupplierForm
          supplier={editingSupplier || null}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Suppliers;
