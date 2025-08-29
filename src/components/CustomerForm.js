import React, { useState, useEffect } from 'react';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        contact: customer.contact || '',
        address: customer.address || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="customer-form">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Contact:
          <input 
            type="text" 
            name="contact" 
            value={formData.contact} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Address:
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
          />
        </label>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
