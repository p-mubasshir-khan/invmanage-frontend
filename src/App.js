import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import AIInsights from './components/AIInsights';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
                         <Route path="/orders" element={<Orders />} />
             <Route path="/customers" element={<Customers />} />
             <Route path="/suppliers" element={<Suppliers />} />
             <Route path="/ai-insights" element={<AIInsights />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
