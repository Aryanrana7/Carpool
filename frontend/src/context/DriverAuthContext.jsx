import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const DriverAuthContext = createContext();

export const DriverAuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInDriver = async () => {
      const token = localStorage.getItem('driverToken');
      if (token) {
        try {
          // Set token in headers specifically for driver routes
          const response = await api.get('/drivers/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDriver(response.data);
        } catch (error) {
          console.error('Driver token invalid or expired');
          localStorage.removeItem('driverToken');
        }
      }
      setLoading(false);
    };

    checkLoggedInDriver();
  }, []);

  const loginDriver = async (email, password) => {
    try {
      const response = await api.post('/drivers/login', { email, password });
      localStorage.setItem('driverToken', response.data.token);
      setDriver(response.data);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const registerDriver = async (driverData) => {
    try {
      const response = await api.post('/drivers/register', driverData);
      localStorage.setItem('driverToken', response.data.token);
      setDriver(response.data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logoutDriver = () => {
    localStorage.removeItem('driverToken');
    setDriver(null);
    toast.success('Logged out');
  };

  return (
    <DriverAuthContext.Provider value={{ driver, loading, loginDriver, registerDriver, logoutDriver }}>
      {!loading && children}
    </DriverAuthContext.Provider>
  );
};
