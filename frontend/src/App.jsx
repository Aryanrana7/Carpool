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

// Lazy loaded routes for production bundle optimization
const Booking = React.lazy(() => import('./pages/Booking'));
const DriverDashboard = React.lazy(() => import('./pages/driver/DriverDashboard'));

// Fullscreen skeleton loader fallback
const PageFallback = () => (
  <div className="w-full h-[calc(100vh-72px)] flex flex-col items-center justify-center p-8 space-y-4 bg-gray-50 dark:bg-[#121212]">
    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 animate-pulse border border-indigo-500/20" />
    <div className="w-32 h-4 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
  </div>
);

const Layout = () => {
  const location = useLocation();
  const isDriverRoute = location.pathname.startsWith('/driver');

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#1c1c1c] transition-colors duration-300">
      {isDriverRoute ? <DriverNavbar /> : <Navbar />}
      <main className="flex-1 flex flex-col relative pt-[72px]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DriverAuthProvider>
        <ThemeProvider>
          {/* SocketProvider needs AuthContext, so it's nested inside */}
          <SocketProvider>
            <DriverSocketProvider>
              <Router>
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
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
  );
}

export default App;
