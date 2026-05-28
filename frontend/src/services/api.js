import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    // DO NOT override if header is already set manually (e.g., in CreateRide)
    if (config.headers.Authorization || config.headers.authorization) {
      return config;
    }

    const driverToken = localStorage.getItem('driverToken');
    const token = localStorage.getItem('token');
    
    if (config.url.includes('/driver')) {
      if (driverToken) config.headers.Authorization = `Bearer ${driverToken}`;
      else if (token) config.headers.Authorization = `Bearer ${token}`;
    } else {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      else if (driverToken) config.headers.Authorization = `Bearer ${driverToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid -> enforce auto-logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('driverToken');
      localStorage.removeItem('driver');
      
      // Prevent redirect loop if already on login pages
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/driver/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
