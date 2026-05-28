import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { MapPin, Navigation, Car, User, ArrowRight, Star, Clock, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.ride) return <Navigate to="/" replace />;

  const { ride, route, pricing, rideType } = location.state;
  const baseFare = pricing?.baseFare ?? (ride.price * 0.65).toFixed(2);
  const distanceFare = pricing?.distanceFare ?? (ride.price * 0.25).toFixed(2);
  const timeFare = pricing?.timeFare ?? (ride.price * 0.10).toFixed(2);
  const surge = pricing?.surgeMultiplier ?? 1.0;

  const infoItems = [
    { label: 'Route', value: `${route?.distance || '—'} · ${route?.duration || '—'}`, icon: Clock },
    { label: 'Surge', value: surge > 1 ? `${surge}× active` : 'No surge', icon: Zap },
    { label: 'Safety', value: 'Verified driver', icon: Shield },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f8f8] dark:bg-[#0c0c0c] flex justify-center items-start pt-10 pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Step 1 of 2</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Review your booking</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Check your route and fare before proceeding to payment.
          </p>
        </div>

        <div className="space-y-4">
          {/* Route card */}
          <div className="card p-6">
            <p className="section-label mb-4">Route</p>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <div className="w-0.5 h-12 bg-gray-200 dark:bg-[#2a2a2a]" />
                <div className="w-3 h-3 bg-violet-500 rounded-sm" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="section-label mb-1">Pickup</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{route?.source?.address || ride.source}</p>
                </div>
                <div>
                  <p className="section-label mb-1">Dropoff</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{route?.destination?.address || ride.destination}</p>
                </div>
              </div>
              {route?.distance && (
                <div className="text-right pl-4 border-l border-gray-100 dark:border-[#242424] flex-shrink-0">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{route.distance}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{route.duration}</p>
                </div>
              )}
            </div>

            {/* Info pills */}
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-[#1e1e1e]">
              {infoItems.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#111] px-3 py-1.5 rounded-full">
                  <Icon size={11} className="text-indigo-400" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver & Vehicle */}
          <div className="card p-6">
            <p className="section-label mb-4">Driver & Vehicle</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                  <User size={22} className="text-indigo-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{ride.driver?.name || 'Assigned Driver'}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-sm font-semibold">{ride.driver?.rating || '4.9'}</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{ride.carType || 'Premium Sedan'}</span>
                  </div>
                </div>
              </div>
              <div className="text-4xl">{rideType === 'mini' ? '🛵' : rideType === 'suv' ? '🚙' : '🚗'}</div>
            </div>
          </div>

          {/* Fare Breakdown */}
          <div className="card p-6">
            <p className="section-label mb-4">Fare Breakdown</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Base fare</span>
                <span className="font-medium text-gray-900 dark:text-white">${baseFare}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Distance charge</span>
                <span className="font-medium text-gray-900 dark:text-white">${distanceFare}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Time charge</span>
                <span className="font-medium text-gray-900 dark:text-white">${timeFare}</span>
              </div>
              {surge > 1.0 && (
                <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                  <span>Surge multiplier ({surge}×)</span>
                  <span className="font-medium">Applied</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-[#242424]">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">${ride.price}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/payment', { state: { ride, route, pricing, rideType } })}
            className="btn-primary w-full py-4 text-base"
          >
            Proceed to Payment <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Booking;
