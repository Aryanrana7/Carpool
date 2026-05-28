import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DriverAuthContext } from '../context/DriverAuthContext';
import Loader from './Loader';

const DriverProtectedRoute = ({ children }) => {
  const { driver, loading } = useContext(DriverAuthContext);

  if (loading) {
    return <div className="h-screen flex justify-center items-center"><Loader /></div>;
  }

  if (!driver) {
    return <Navigate to="/driver/login" />;
  }

  return children ? children : <Outlet />;
};

export default DriverProtectedRoute;
