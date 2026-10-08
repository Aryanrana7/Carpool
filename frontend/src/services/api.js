import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization || config.headers.authorization) {
      return config;
    }

    const driverToken = localStorage.getItem('driverToken');
    const token = localStorage.getItem('token');
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const onDriverPortal = path.startsWith('/driver');

    if (onDriverPortal || (config.url && config.url.includes('/driver'))) {
      if (driverToken) config.headers.Authorization = `Bearer ${driverToken}`;
      else if (token) config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (driverToken) {
      config.headers.Authorization = `Bearer ${driverToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const path = window.location.pathname;
      const sent = error.config?.headers?.Authorization;
      const driverToken = localStorage.getItem('driverToken');
      const usedDriverToken = Boolean(driverToken && sent === `Bearer ${driverToken}`);
      const onDriverPortal = path.startsWith('/driver');

      if (usedDriverToken || onDriverPortal) {
        localStorage.removeItem('driverToken');
        localStorage.removeItem('driver');
        if (onDriverPortal && path !== '/driver/login' && path !== '/driver/register') {
          window.location.href = '/driver/login';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (path !== '/login' && path !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
