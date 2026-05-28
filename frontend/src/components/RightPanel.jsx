import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Navigation, User, Car, Clock, DollarSign,
  Users, Star, Zap, Shield, ArrowRight, ChevronRight
} from 'lucide-react';
import StarRating from './StarRating';

const RIDE_EMOJI = { mini: '🛵', sedan: '🚗', suv: '🚙' };
const RIDE_LABEL = { mini: 'Mini', sedan: 'Sedan', suv: 'SUV' };

/* ── Skeleton while loading ─────────────────────────────────────── */
const PanelSkeleton = () => (
  <div className="p-6 space-y-5 animate-pulse">
    {/* Avatar + name */}
    <div className="flex items-center gap-4">
      <div className="skeleton w-14 h-14 rounded-2xl flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-3 w-24" />
      </div>
      <div className="skeleton h-8 w-16 rounded-full" />
    </div>
    {/* Route block */}
    <div className="skeleton h-28 w-full rounded-2xl" />
    {/* Fare block */}
    <div className="skeleton h-36 w-full rounded-2xl" />
    {/* Button */}
    <div className="skeleton h-14 w-full rounded-2xl" />
  </div>
);

/* ── Row helpers ────────────────────────────────────────────────── */
const FareRow = ({ label, value, highlight = false, surge = false }) => (
  <div className={`flex justify-between items-center text-sm ${highlight ? 'font-black text-base' : ''}`}>
    <span className={`${surge ? 'text-amber-500 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>{label}</span>
    <span className={`font-semibold ${highlight ? 'text-gray-900 dark:text-white text-xl' : 'text-gray-700 dark:text-gray-200'} ${surge ? 'text-amber-500 dark:text-amber-400' : ''}`}>
      {value}
    </span>
  </div>
);

/* ── Main component ─────────────────────────────────────────────── */
const RightPanel = ({ ride, route, pricing, rideType, onBook, onClose, loading = false }) => {
  const isOpen = !!(ride || loading);

  // Derived fare data
  const base = pricing?.baseFare       ?? (ride ? (ride.price * 0.65).toFixed(2) : null);
  const dist = pricing?.distanceFare   ?? (ride ? (ride.price * 0.25).toFixed(2) : null);
  const time = pricing?.timeFare       ?? (ride ? (ride.price * 0.10).toFixed(2) : null);
  const surge = pricing?.surgeMultiplier ?? 1.0;
  const total = ride?.price;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 z-[200] bg-black/20 dark:bg-black/40 backdrop-blur-[1px]"
          />

          {/* ── Slide-in panel ──────────────────────────────────── */}
          <motion.div
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }}
            className="absolute top-0 right-0 bottom-0 z-[300] w-[360px] flex flex-col bg-white dark:bg-[#111] border-l border-gray-100 dark:border-[#1e1e1e] shadow-2xl overflow-hidden"
          >
            {/* ── Header ────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-[#1a1a1a] flex-shrink-0">
              <div>
                <p className="section-label">Selected Ride</p>
                <h2 className="font-black text-[15px] text-gray-900 dark:text-white mt-0.5">Booking Details</h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1e1e1e] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-all"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* ── Scrollable body ───────────────────────────────── */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {loading ? (
                <PanelSkeleton />
              ) : ride ? (
                <div className="p-5 space-y-4">

                  {/* Driver card */}
                  <div className="surface rounded-2xl p-4">
                    <p className="section-label mb-3">Driver & Vehicle</p>
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg flex-shrink-0">
                        {ride.driver?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight truncate">
                          {ride.driver?.name || 'Verified Driver'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StarRating
                            rating={ride.driver?.averageRating || 0}
                            count={ride.driver?.totalReviews}
                            size="sm"
                          />
                          <span className="text-gray-200 dark:text-gray-700">·</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {ride.carType || 'Standard Sedan'}
                          </span>
                        </div>
                      </div>
                      {/* Ride type badge */}
                      <div className="flex-shrink-0 text-center">
                        <div className="text-2xl">{RIDE_EMOJI[rideType] ?? '🚗'}</div>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{RIDE_LABEL[rideType] ?? 'Sedan'}</p>
                      </div>
                    </div>

                    {/* Safety pills */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-[#1e1e1e]">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full font-semibold">
                        <Shield size={10} /> Verified
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-full font-semibold">
                        <Users size={10} /> {ride.seats} seats left
                      </div>
                      {surge > 1 && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full font-semibold">
                          <Zap size={10} /> {surge}× surge
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="surface rounded-2xl p-4">
                    <p className="section-label mb-3">Route</p>
                    <div className="relative pl-5 space-y-4">
                      {/* Connector line */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100 dark:bg-[#2a2a2a]" />
                      <div className="absolute left-1 top-1.5 w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30" />
                      <div className="absolute left-1 bottom-1.5 w-3 h-3 bg-violet-500 rounded-sm shadow-lg shadow-violet-500/30" />

                      <div>
                        <p className="section-label mb-0.5">Pickup</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                          {route?.source?.address || ride.source}
                        </p>
                      </div>
                      <div>
                        <p className="section-label mb-0.5">Dropoff</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                          {route?.destination?.address || ride.destination}
                        </p>
                      </div>
                    </div>

                    {/* Distance + time chips */}
                    {(route?.distance || route?.duration) && (
                      <div className="flex gap-3 mt-4 pt-3 border-t border-gray-50 dark:border-[#1e1e1e]">
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-2 rounded-xl flex-1 justify-center">
                          <Navigation size={12} className="text-indigo-500" />
                          <span className="text-sm font-black text-gray-900 dark:text-white">{route.distance}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-2 rounded-xl flex-1 justify-center">
                          <Clock size={12} className="text-violet-500" />
                          <span className="text-sm font-black text-gray-900 dark:text-white">{route.duration}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fare breakdown */}
                  <div className="surface rounded-2xl p-4">
                    <p className="section-label mb-3">Fare Breakdown</p>
                    <div className="space-y-2.5">
                      <FareRow label="Base fare" value={`$${base}`} />
                      <FareRow label="Distance charge" value={`$${dist}`} />
                      <FareRow label="Time charge" value={`$${time}`} />
                      {surge > 1 && (
                        <FareRow label={`Surge (${surge}×)`} value="Applied" surge />
                      )}
                      <div className="pt-3 mt-1 border-t border-gray-50 dark:border-[#1e1e1e]">
                        <FareRow label="Total" value={`$${total}`} highlight />
                      </div>
                    </div>
                  </div>

                  {/* Departure time */}
                  {ride.time && (
                    <div className="flex items-center gap-3 surface rounded-2xl px-4 py-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-[#1e1e1e] rounded-xl flex items-center justify-center">
                        <Clock size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="section-label">Departure</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {new Date(ride.time).toLocaleString('en', {
                            weekday: 'short', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              ) : null}
            </div>

            {/* ── Footer CTA ────────────────────────────────────── */}
            {!loading && ride && (
              <div className="flex-shrink-0 p-5 pt-0 space-y-2.5 border-t border-gray-50 dark:border-[#1a1a1a]">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onBook(ride)}
                  className="btn-accent w-full py-4 text-[15px]"
                >
                  <span>Confirm Booking</span>
                  <ArrowRight size={18} />
                </motion.button>
                <button
                  onClick={onClose}
                  className="btn-ghost w-full py-3 text-sm text-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
