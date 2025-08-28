import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard">Inventory Management</Link>
        </div>
        
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/orders" 
              className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
            >
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/customers" 
              className={`nav-link ${isActive('/customers') ? 'active' : ''}`}
            >
              Customers
            </Link>
          </li>
                     <li className="nav-item">
             <Link 
               to="/suppliers" 
               className={`nav-link ${isActive('/suppliers') ? 'active' : ''}`}
             >
               Suppliers
             </Link>
           </li>
           <li className="nav-item">
             <Link 
               to="/ai-insights" 
               className={`nav-link ${isActive('/ai-insights') ? 'active' : ''}`}
             >
               🤖 AI Insights
             </Link>
           </li>
        </ul>
        
        <div className="navbar-right">
          <button onClick={onLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
