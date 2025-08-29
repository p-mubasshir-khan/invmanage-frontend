import React, { useState, useEffect } from "react";
import "./CustomerForm.css";

const CustomerForm = ({ customer, onSubmit, onClose }) => {
  // Initialize form state with safe defaults
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
  });

  // Log customer prop for debugging
  useEffect(() => {
    console.log("Customer prop received:", customer);
    if (customer) {
      setFormData({
        name: customer.name || "",
        contact: customer.contact || "",
        address: customer.address || "",
      });
    }
  }, [customer]);

  // Log formData whenever it changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="customer-form">
      <h2>{customer ? "Edit Customer" : "Add Customer"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </label>

        <label>
          Contact:
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter contact"
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </label>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
