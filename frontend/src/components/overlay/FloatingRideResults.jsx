import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Clock, User, Users, ChevronRight, Zap } from 'lucide-react';

const RIDE_EMOJI = { mini: '🛵', sedan: '🚗', suv: '🚙' };

/* ── Skeleton card ────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-52 bg-white/5 rounded-2xl p-4 animate-pulse space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 skeleton rounded-xl flex-shrink-0" />
      <div className="space-y-1.5 flex-1">
        <div className="skeleton h-3.5 w-24 rounded" />
        <div className="skeleton h-2.5 w-16 rounded" />
      </div>
    </div>
    <div className="skeleton h-8 w-full rounded-xl" />
  </div>
);

/* ── Individual ride card (horizontal) ───────────────── */
const RideHorizontalCard = React.memo(({ ride, selected, onSelect, onHoverIn, onHoverOut }) => (
  <motion.div
    animate={{
      scale: selected ? 1.03 : 1,
      boxShadow: selected ? '0 0 25px rgba(99,102,241,0.45)' : '0 4px 12px rgba(0,0,0,0.1)'
    }}
    whileHover={{
      y: selected ? 0 : -4,
      scale: selected ? 1.03 : 1.02,
      boxShadow: selected ? '0 0 30px rgba(99,102,241,0.6)' : '0 12px 24px rgba(0,0,0,0.3)'
    }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    onClick={() => onSelect(ride)}
    onMouseEnter={() => onHoverIn(ride)}
    onMouseLeave={() => onHoverOut(null)}
    className={`flex-shrink-0 w-52 rounded-2xl p-4 cursor-pointer border-2 transition-colors duration-200 ${
      selected
        ? 'border-indigo-400 bg-white/15'
        : 'border-transparent bg-white/8 hover:bg-white/12 hover:border-white/20'
    }`}
    style={{ backgroundColor: selected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.07)' }}
  >
    {/* Top row */}
    <div className="flex items-start gap-2.5 mb-3">
      <div className="text-2xl flex-shrink-0 leading-none mt-0.5">
        {RIDE_EMOJI[ride.rideType] ?? '🚗'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13px] text-white truncate leading-tight">
          {ride.carType || 'Standard Sedan'}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <User size={10} className="text-white/40 flex-shrink-0" />
          <p className="text-[10px] text-white/50 truncate">{ride.driver?.name || 'Verified Driver'}</p>
        </div>
      </div>
    </div>

    {/* Details row */}
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1 text-[10px] text-white/50">
        <Clock size={9} />
        <span>{new Date(ride.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="w-px h-3 bg-white/10" />
      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
        ride.seats > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {ride.seats > 0 ? `${ride.seats} seats` : 'Full'}
      </div>
    </div>

    {/* Price + CTA */}
    <div className="flex items-center justify-between">
      <span className="text-xl font-black text-white">${ride.price}</span>
      <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
        selected
          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
          : 'bg-white/10 text-white/70'
      }`}>
        {selected ? <><Zap size={11} /> Selected</> : <>View <ChevronRight size={11} /></>}
      </div>
    </div>
  </motion.div>
));

/* ── Main component ───────────────────────────────────── */
const FloatingRideResults = ({ show, rides, loading, selectedRide, onSelectRide, onHoverRide, onClose }) => {
  const listRef = useRef(null);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="results-panel"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] w-[calc(100%-360px)] max-w-3xl"
          style={{ left: 'calc(50% + 40px)' }}
        >
          <div
            className="rounded-2xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden"
            style={{ background: 'rgba(14,14,14,0.88)', backdropFilter: 'blur(20px) saturate(1.4)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <Car size={14} className="text-indigo-400" />
                <p className="text-[13px] font-black text-white">
                  {loading ? 'Searching rides…' : `${rides.length} ride${rides.length !== 1 ? 's' : ''} available`}
                </p>
                {!loading && rides.length > 0 && (
                  <span className="text-[10px] text-white/40 font-medium">· click a card to see full details</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xl bg-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all"
              >
                <X size={13} />
              </button>
            </div>

            {/* Horizontal scrollable list */}
            <div
              ref={listRef}
              className="flex gap-3 px-5 pb-4 pt-2 overflow-x-auto scrollbar-none"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : rides.length === 0 ? (
                <div className="flex-1 py-8 text-center">
                  <p className="text-2xl mb-2">🗺️</p>
                  <p className="text-white/40 text-sm font-semibold">No rides found for this route</p>
                  <p className="text-white/25 text-xs mt-1">Try different locations</p>
                </div>
              ) : (
                rides.map(ride => (
                  <RideHorizontalCard
                    key={ride._id}
                    ride={ride}
                    selected={selectedRide?._id === ride._id}
                    onSelect={onSelectRide}
                    onHoverIn={onHoverRide}
                    onHoverOut={onHoverRide}
                  />
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingRideResults;
