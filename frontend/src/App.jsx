import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DriverAuthProvider } from './context/DriverAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { DriverSocketProvider } from './context/DriverSocketContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import MyRides from './pages/MyRides';

import DriverNavbar from './components/DriverNavbar';
import DriverProtectedRoute from './components/DriverProtectedRoute';
import DriverLogin from './pages/driver/DriverLogin';
import DriverRegister from './pages/driver/DriverRegister';
import CreateRide from './pages/driver/CreateRide';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded routes for production bundle optimization
const Booking = React.lazy(() => import('./pages/Booking'));
const DriverDashboard = React.lazy(() => import('./pages/driver/DriverDashboard'));

// Fullscreen skeleton loader fallback
const PageFallback = () => (
  <div className="w-full h-[calc(100vh-68px)] flex flex-col items-center justify-center p-8 space-y-4 bg-background">
    <div className="w-10 h-10 rounded-lg bg-primary-subtle animate-pulse border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
      CP
    </div>
    <div className="w-24 h-2.5 rounded-full bg-border animate-pulse" />
  </div>
);

const Layout = () => {
  const location = useLocation();
  const isDriverRoute = location.pathname.startsWith('/driver');

  return (
    <div className="min-h-screen flex flex-col font-sans text-text-primary bg-background transition-colors duration-200">
      {isDriverRoute ? <DriverNavbar /> : <Navbar />}
      <main className="flex-1 flex flex-col relative pt-[68px]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DriverAuthProvider>
          <ThemeProvider>
            <SocketProvider>
              <DriverSocketProvider>
                <Router>
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      duration: 3500,
                      style: {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px -4px rgba(11, 18, 32, 0.12)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        padding: '10px 16px',
                      },
                    }}
                  />
                  <Routes>
                    <Route element={<Layout />}>
                      {/* User Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/my-rides" element={<MyRides />} />
                      </Route>

                      {/* Driver Routes */}
                      <Route path="/driver/login" element={<DriverLogin />} />
                      <Route path="/driver/register" element={<DriverRegister />} />

                      <Route element={<DriverProtectedRoute />}>
                        <Route path="/driver/dashboard" element={<DriverDashboard />} />
                        <Route path="/driver/create-ride" element={<CreateRide />} />
                      </Route>
                    </Route>
                  </Routes>
                </Router>
              </DriverSocketProvider>
            </SocketProvider>
          </ThemeProvider>
        </DriverAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
