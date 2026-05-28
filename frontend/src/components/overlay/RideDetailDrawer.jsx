import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Navigation, User, Car, Clock, DollarSign,
  Star, Zap, Shield, Users, ArrowRight
} from 'lucide-react';

const RIDE_EMOJI = { mini: '🛵', sedan: '🚗', suv: '🚙' };
const RIDE_LABEL = { mini: 'Mini', sedan: 'Sedan', suv: 'SUV' };

/* ── Skeleton ─────────────────────────────────────── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-white/8 ${className}`} />
);

const DrawerSkeleton = () => (
  <div className="p-6 space-y-5">
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-28 w-full rounded-2xl" />
    <Skeleton className="h-36 w-full rounded-2xl" />
    <Skeleton className="h-14 w-full rounded-2xl" />
  </div>
);

/* ── Section wrapper ──────────────────────────────── */
const Section = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl p-4 border border-white/8 ${className}`}
    style={{ background: 'rgba(255,255,255,0.05)' }}
  >
    {children}
  </div>
);

/* ── Fare row ─────────────────────────────────────── */
const FareRow = ({ label, value, highlight, surge }) => (
  <div className={`flex justify-between items-center text-sm ${highlight ? 'pt-3 border-t border-white/8 mt-2' : ''}`}>
    <span className={surge ? 'text-amber-400' : 'text-white/50'}>{label}</span>
    <span className={`font-semibold ${highlight ? 'text-white text-xl font-black' : surge ? 'text-amber-400' : 'text-white/80'}`}>
      {value}
    </span>
  </div>
);

/* ── Main drawer ──────────────────────────────────── */
const RideDetailDrawer = ({ show, ride, loading, route, pricing, rideType, onBook, onClose }) => {
  const base  = pricing?.baseFare       ?? (ride ? (ride.price * 0.65).toFixed(2) : null);
  const dist  = pricing?.distanceFare   ?? (ride ? (ride.price * 0.25).toFixed(2) : null);
  const time  = pricing?.timeFare       ?? (ride ? (ride.price * 0.10).toFixed(2) : null);
  const surge = pricing?.surgeMultiplier ?? 1.0;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Subtle backdrop — doesn't fully cover the map */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 z-[600]"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(1px)' }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 36, mass: 0.85 }}
            className="absolute top-0 right-0 bottom-0 z-[700] w-[360px] flex flex-col shadow-2xl"
            style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(24px) saturate(1.5)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Booking Details</p>
                <h2 className="font-black text-[16px] text-white mt-0.5">Your selected ride</h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <X size={14} className="text-white/60" />
              </motion.button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {loading ? (
                <DrawerSkeleton />
              ) : ride ? (
                <div className="p-5 space-y-3">

                  {/* ── Driver ──────────────────────── */}
                  <Section>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.12em] mb-3">Driver & Vehicle</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0"
                        style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
                        {ride.driver?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15px] text-white truncate">
                          {ride.driver?.name || 'Verified Driver'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={10} className="text-amber-400" fill="currentColor" />
                            <span className="text-xs text-white/60 font-semibold">{ride.driver?.rating ?? '4.9'}</span>
                          </div>
                          <span className="text-white/20">·</span>
                          <span className="text-xs text-white/50 truncate">{ride.carType || 'Sedan'}</span>
                        </div>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-2xl">{RIDE_EMOJI[rideType] ?? '🚗'}</div>
                        <p className="text-[9px] text-white/30 font-bold mt-0.5">{RIDE_LABEL[rideType] ?? 'Sedan'}</p>
                      </div>
                    </div>

                    {/* Pills */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5 flex-wrap">
                      <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                        <Shield size={10} /> Verified
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                        <Users size={10} /> {ride.seats} seats
                      </div>
                      {surge > 1 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                          <Zap size={10} /> {surge}× surge
                        </div>
                      )}
                    </div>
                  </Section>

                  {/* ── Route ───────────────────────── */}
                  <Section>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.12em] mb-3">Route</p>
                    <div className="relative pl-5 space-y-4">
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                      <div className="absolute left-1 top-1.5 w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40" />
                      <div className="absolute left-1 bottom-1.5 w-3 h-3 rounded-sm bg-violet-500 shadow-lg shadow-violet-500/40" />
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-bold mb-0.5">Pickup</p>
                        <p className="text-[13px] font-semibold text-white/90 leading-tight line-clamp-2">
                          {route?.source?.address || ride.source}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-bold mb-0.5">Dropoff</p>
                        <p className="text-[13px] font-semibold text-white/90 leading-tight line-clamp-2">
                          {route?.destination?.address || ride.destination}
                        </p>
                      </div>
                    </div>

                    {(route?.distance || route?.duration) && (
                      <div className="flex gap-3 mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl"
                          style={{ background: 'rgba(99,102,241,0.12)' }}>
                          <Navigation size={11} className="text-indigo-400" />
                          <span className="text-sm font-black text-white">{route.distance}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl"
                          style={{ background: 'rgba(139,92,246,0.12)' }}>
                          <Clock size={11} className="text-violet-400" />
                          <span className="text-sm font-black text-white">{route.duration}</span>
                        </div>
                      </div>
                    )}
                  </Section>

                  {/* ── Fare breakdown ───────────────── */}
                  <Section>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.12em] mb-3">Fare Breakdown</p>
                    <div className="space-y-2">
                      <FareRow label="Base fare" value={`$${base}`} />
                      <FareRow label="Distance charge" value={`$${dist}`} />
                      <FareRow label="Time charge" value={`$${time}`} />
                      {surge > 1 && <FareRow label={`Surge (${surge}×)`} value="Applied" surge />}
                      <FareRow label="Total" value={`$${ride.price}`} highlight />
                    </div>
                  </Section>

                  {/* ── Departure ───────────────────── */}
                  {ride.time && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <Clock size={14} className="text-white/50" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-bold">Departure</p>
                        <p className="text-sm font-bold text-white/90">
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

            {/* ── Footer CTAs ─────────────────────── */}
            {!loading && ride && (
              <div className="flex-shrink-0 p-5 space-y-2.5 border-t border-white/8">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 16px 32px -4px rgba(99,102,241,0.5)' }}
                  whileTap={{ scale: 0.96, boxShadow: '0 0 25px rgba(124,58,237,0.8)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => onBook(ride)}
                  className="w-full flex items-center justify-center gap-2 text-white text-[15px] font-black py-4 rounded-2xl transition-colors shadow-2xl shadow-indigo-600/30"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}
                >
                  Confirm Booking <ArrowRight size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="w-full py-3 text-sm font-semibold text-white/40 hover:text-white/70 transition-colors rounded-2xl"
                >
                  Cancel
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RideDetailDrawer;
