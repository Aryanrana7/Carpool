import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DriverAuthProvider } from './context/DriverAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { DriverSocketProvider } from './context/DriverSocketContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DriverNavbar from './components/DriverNavbar';
import DriverProtectedRoute from './components/DriverProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import FooterSection from './components/FooterSection';

// Lazy loaded route pages for optimal production bundle splitting
const Home = React.lazy(() => import('./pages/Home'));
const AuthPortal = React.lazy(() => import('./components/auth/AuthPortal'));
const Register = React.lazy(() => import('./pages/Register'));
const Payment = React.lazy(() => import('./pages/Payment'));
const MyRides = React.lazy(() => import('./pages/MyRides'));
const Booking = React.lazy(() => import('./pages/Booking'));
const DriverRegister = React.lazy(() => import('./pages/driver/DriverRegister'));
const DriverDashboard = React.lazy(() => import('./pages/driver/DriverDashboard'));
const CreateRide = React.lazy(() => import('./pages/driver/CreateRide'));

// Support & Help Center Pages
const ContactUs = React.lazy(() => import('./pages/support/ContactUs'));
const HelpFaq = React.lazy(() => import('./pages/support/HelpFaq'));
const ReportProblem = React.lazy(() => import('./pages/support/ReportProblem'));
const SafetyHelp = React.lazy(() => import('./pages/support/SafetyHelp'));
const FeedbackPage = React.lazy(() => import('./pages/support/FeedbackPage'));

// Accessible skeleton fallback
const PageFallback = () => (
  <div className="w-full h-[calc(100vh-68px)] flex flex-col items-center justify-center p-8 space-y-3 bg-background">
    <div className="w-10 h-10 rounded-lg bg-primary-subtle border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
      CP
    </div>
    <div className="w-20 h-2 rounded-full bg-border animate-pulse" />
  </div>
);

const Layout = () => {
  const location = useLocation();
  // Keep shared Navbar stable during authentication portal switching (/login and /driver/login)
  const isDriverRoute = location.pathname.startsWith('/driver') && location.pathname !== '/driver/login';
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/driver/login';

  useEffect(() => {
    document.title = 'CarPool';
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-text-primary bg-background transition-colors duration-200">
      {isDriverRoute ? <DriverNavbar /> : <Navbar />}
      <main className="flex-1 flex flex-col relative pt-[68px] isolate">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      {!isAuthRoute && <FooterSection />}
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
                      {/* Passenger & Driver Split-Screen Animated Portals */}
                      <Route path="/login" element={<AuthPortal />} />
                      <Route path="/register" element={<Register />} />

                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/my-rides" element={<MyRides />} />
                      </Route>

                      {/* Driver Routes */}
                      <Route path="/driver/login" element={<AuthPortal />} />
                      <Route path="/driver/register" element={<DriverRegister />} />

                      <Route element={<DriverProtectedRoute />}>
                        <Route path="/driver/dashboard" element={<DriverDashboard />} />
                        <Route path="/driver/create-ride" element={<CreateRide />} />
                      </Route>

                      {/* Contact & Support System Routes (Accessible to all users) */}
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/help" element={<HelpFaq />} />
                      <Route path="/faq" element={<HelpFaq />} />
                      <Route path="/report-problem" element={<ReportProblem />} />
                      <Route path="/safety" element={<SafetyHelp />} />
                      <Route path="/feedback" element={<FeedbackPage />} />
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
