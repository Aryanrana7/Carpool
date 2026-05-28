import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Smartphone, Wallet, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const METHODS = [
  { id: 'card',   label: 'Credit / Debit Card', icon: CreditCard,   desc: 'Visa, Mastercard, Amex' },
  { id: 'upi',    label: 'UPI / Google Pay',     icon: Smartphone,   desc: 'Pay with any UPI app' },
  { id: 'wallet', label: 'Digital Wallet',        icon: Wallet,       desc: 'Carpool balance' },
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.ride) return <Navigate to="/" replace />;

  const { ride } = location.state;
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await api.post('/bookings', { rideId: ride._id });
        setSuccess(true);
        toast.success('Payment successful! Ride booked.', { icon: '🎉' });
        setTimeout(() => navigate('/my-rides'), 2500);
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message || 'Payment failed. Please try again.';
        
        toast.error(msg, { icon: '⚠️' });
        
        if (status === 400 || status === 404) {
          // UX Fallback: Redirect if ride is unavailable or already booked
          setTimeout(() => navigate('/', { replace: true }), 2500);
        } else {
          setLoading(false);
        }
      }
    }, 1200);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8f8f8] dark:bg-[#0c0c0c]">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, damping: 16, stiffness: 260 }}
            className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-emerald-500" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400">Your driver will meet you at the pickup point.</p>
          <div className="mt-3 text-sm text-gray-400">Redirecting to your trips…</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f8f8] dark:bg-[#0c0c0c] flex justify-center items-start pt-10 pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Step 2 of 2</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Payment</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Choose how you'd like to pay.</p>
        </div>

        {/* Amount card */}
        <div className="card p-5 mb-4 flex items-center justify-between">
          <div>
            <p className="section-label mb-1">Amount due</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">${ride.price}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{ride.carType || 'Standard Sedan'}</p>
            <p className="text-xs text-gray-400 mt-0.5">1 seat · estimated fare</p>
          </div>
        </div>

        {/* Payment methods */}
        <div className="card overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-100 dark:border-[#1e1e1e]">
            <p className="section-label">Select Payment Method</p>
          </div>
          <div className="p-3 space-y-2">
            {METHODS.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150 text-left ${
                  method === id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  method === id ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-[#222] text-gray-500 dark:text-gray-400'
                }`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${method === id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  method === id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {method === id && <div className="w-full h-full rounded-full bg-white scale-50" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 px-1">
          <Lock size={11} />
          <span>Your payment is secured with 256-bit SSL encryption.</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2.5">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing payment…
            </span>
          ) : (
            <span className="flex items-center gap-2">Pay ${ride.price} <ArrowRight size={18} /></span>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default Payment;
