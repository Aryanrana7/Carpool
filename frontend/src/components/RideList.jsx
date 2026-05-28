import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RideCard from './RideCard';
import { Car } from 'lucide-react';

const RideListSkeleton = () => (
  <div className="animate-pulse space-y-3 p-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4 rounded-2xl border border-gray-100 dark:border-[#1e1e1e] bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton w-2/3" />
            <div className="h-3 skeleton w-1/2" />
          </div>
          <div className="h-7 w-14 skeleton rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

const RideList = ({ rides, loading, hasSearched, selectedRide, onSelectRide, onHoverRide, onBook }) => {
  return (
    <div className={`h-full flex flex-col bg-white dark:bg-[#111] border-r border-gray-100 dark:border-[#1e1e1e] relative transition-all duration-500 ease-in-out overflow-hidden flex-shrink-0 z-10 ${
      hasSearched ? 'w-[300px] opacity-100' : 'w-0 opacity-0'
    }`}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-[#1a1a1a] flex-shrink-0">
        <div>
          <h2 className="font-black text-[15px] text-gray-900 dark:text-white">Choose a ride</h2>
          {!loading && rides.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{rides.length} options · click to view details</p>
          )}
        </div>
      </div>

      {/* Scrollable list — no bottom booking panel, that's in RightPanel now */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {loading ? (
          <RideListSkeleton />
        ) : rides.length > 0 ? (
          <div className="p-3 space-y-2">
            {rides.map((ride, idx) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.25 }}
                onMouseEnter={() => onHoverRide(ride)}
                onMouseLeave={() => onHoverRide(null)}
              >
                <RideCard
                  ride={ride}
                  selected={selectedRide?._id === ride._id}
                  onSelect={onSelectRide}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-3">
              <Car size={22} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">No rides found</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Try a different route</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideList;
