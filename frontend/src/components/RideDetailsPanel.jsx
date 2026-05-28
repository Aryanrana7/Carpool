import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowRight, Clock, Users } from 'lucide-react';

const RideDetailsPanel = ({ selectedRide, onBook }) => {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 380 }}
      className="absolute bottom-0 left-0 right-0 z-50 p-5 bg-white dark:bg-[#161616] border-t border-gray-100 dark:border-[#242424] shadow-2xl"
    >
      {/* Drag handle */}
      <div className="w-8 h-1 bg-gray-200 dark:bg-[#333] rounded-full mx-auto mb-4" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="section-label mb-1">Selected Ride</p>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {selectedRide.carType || 'Standard Sedan'}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {selectedRide.driver?.name || 'Assigned Driver'} · {selectedRide.seats} seats available
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gray-900 dark:text-white">${selectedRide.price}</p>
          <p className="text-xs text-gray-400 mt-0.5">total fare</p>
        </div>
      </div>

      {/* Route preview */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#111] rounded-xl p-3">
        <MapPin size={12} className="text-indigo-500 flex-shrink-0" />
        <span className="truncate">{selectedRide.source}</span>
        <ArrowRight size={12} className="flex-shrink-0 text-gray-300" />
        <Navigation size={12} className="text-violet-500 flex-shrink-0" />
        <span className="truncate">{selectedRide.destination}</span>
      </div>

      <button
        onClick={() => onBook(selectedRide)}
        className="btn-accent w-full py-3.5 text-sm font-bold"
      >
        Book this ride <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};

export default RideDetailsPanel;
