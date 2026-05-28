import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, DollarSign, Clock } from 'lucide-react';
import { Shimmer } from './SkeletonLoaders';

const STATUS = {
  confirmed:   { label: 'Accepted',   step: 1, badge: 'badge-success' },
  in_progress: { label: 'En Route',   step: 2, badge: 'badge-info' },
  completed:   { label: 'Completed',  step: 3, badge: 'badge-violet' },
};

const steps = [
  { label: 'Accepted', step: 1 },
  { label: 'En Route', step: 2 },
  { label: 'Done',     step: 3 },
];

const ActiveRidePanel = ({ booking, onUpdateStatus, onChatOpen }) => {
  if (!booking) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4 text-3xl">
          🚗
        </div>
        <p className="font-bold text-sm text-gray-400">No Active Ride</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1 max-w-[160px]">Accept a request to start a ride</p>
      </div>
    );
  }

  const progress = STATUS[booking.status]?.step ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card h-full flex flex-col overflow-hidden"
    >
      {/* Header band */}
      <div className="bg-emerald-500 px-5 py-4 flex-shrink-0">
        <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Active Ride</p>
        <h2 className="text-white text-lg font-black mt-0.5">Ride in Progress</h2>
        <p className="text-emerald-100/70 text-[10px] mt-0.5">#{booking._id?.slice(-8).toUpperCase()}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
        {/* Progress bar */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-[18px] h-0.5 bg-gray-100 dark:bg-[#1e1e1e] z-0">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((progress - 1) / 2) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-emerald-500"
            />
          </div>
          {steps.map(s => (
            <div key={s.step} className="flex flex-col items-center z-10 relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                progress >= s.step
                  ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30 text-white'
                  : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#2a2a2a]'
              }`}>
                {progress >= s.step ? '✓' : s.step}
              </div>
              <p className={`text-[10px] font-bold mt-1.5 ${progress >= s.step ? 'text-emerald-500' : 'text-gray-400'}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Passenger */}
        <div className="surface rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="section-label mb-0">Passenger</p>
            <button
              onClick={() => onChatOpen(booking)}
              className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              💬 Message
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-base">
              {booking.user?.name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{booking.user?.name}</p>
              <p className="text-xs text-gray-400">{booking.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="surface rounded-xl p-3.5">
          <p className="section-label mb-3">Route</p>
          <div className="relative pl-5 space-y-3">
            <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-gray-100 dark:bg-[#2a2a2a]" />
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-indigo-500 rounded-full" />
            <div className="absolute left-0 bottom-1.5 w-3 h-3 bg-violet-500 rounded-sm" />
            <div>
              <p className="section-label mb-0.5">Pickup</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{booking.ride?.source}</p>
            </div>
            <div>
              <p className="section-label mb-0.5">Dropoff</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{booking.ride?.destination}</p>
            </div>
          </div>
        </div>

        {/* Fare + time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="surface rounded-xl p-3 text-center">
            <p className="section-label mb-1">Fare</p>
            <p className="text-xl font-black text-emerald-500">${booking.ride?.price ?? '—'}</p>
          </div>
          <div className="surface rounded-xl p-3 text-center">
            <p className="section-label mb-1">Time</p>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {booking.ride?.time ? new Date(booking.ride.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        {booking.status === 'confirmed' && (
          <button onClick={() => onUpdateStatus(booking, 'in_progress')} className="btn-accent w-full py-3">
            🚗 Start Ride
          </button>
        )}
        {booking.status === 'in_progress' && (
          <button onClick={() => onUpdateStatus(booking, 'completed')} className="btn-success w-full py-3">
            🏁 Complete Ride
          </button>
        )}
        {booking.status === 'completed' && (
          <div className="badge-success w-full justify-center py-3 rounded-xl text-sm">
            🎉 Ride Completed! Earnings recorded.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActiveRidePanel;
