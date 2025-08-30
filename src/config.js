// API Configuration
const config = {
  // Production API URL (Render backend)
  production: {
    apiUrl: 'https://invmanage-backend.onrender.com'
  },
  // Development API URL (local backend)
  development: {
    apiUrl: 'http://localhost:5000'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const API_BASE_URL = config[environment].apiUrl;

// Fallback to proxy if no environment variable is set
export const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return API_BASE_URL;
};

// Default API URL for components
export const DEFAULT_API_URL = getApiUrl();
