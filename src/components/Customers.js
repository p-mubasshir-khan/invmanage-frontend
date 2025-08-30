import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config';
import CustomerForm from './CustomerForm';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/api/customers`);
      setCustomers(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage('Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer || null);
    setShowForm(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!customerId) return;
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${getApiUrl()}/api/customers/${customerId}`);
        setCustomers((customers || []).filter(c => c?.id !== customerId));
        setMessage('Customer deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting customer:', error);
        setMessage('Error deleting customer');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleFormSubmit = async (customerData) => {
    if (!customerData) return;
    try {
      if (editingCustomer?.id) {
        const response = await axios.put(
          `${getApiUrl()}/api/customers/${editingCustomer.id}`,
          customerData
        );
        setCustomers((customers || []).map(c => (c?.id === editingCustomer.id ? response?.data : c)));
        setMessage('Customer updated successfully');
      } else {
        const response = await axios.post(`${getApiUrl()}/api/customers`, customerData);
        setCustomers([...(customers || []), response?.data]);
        setMessage('Customer added successfully');
      }
      setShowForm(false);
      setEditingCustomer(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving customer:', error);
      setMessage('Error saving customer');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customers">
      <div className="customers-header">
        <h1 className="page-title">Customers</h1>
        <button onClick={handleAddCustomer} className="btn btn-primary">
          Add Customer
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
            {(Array.isArray(customers) ? customers : []).map(customer => (
              <tr key={customer?._id || Math.random()}>
                <td>{customer?.name ?? '-'}</td>
                <td>{customer?.contact ?? '-'}</td>
                <td>{customer?.address ?? '-'}</td>
                <td>
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer?._id)}
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
        <CustomerForm
          customer={editingCustomer || null}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Customers;
