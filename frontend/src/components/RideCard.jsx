import React from 'react';
import { Clock, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';

const RIDE_TYPE_ICONS = { mini: '🛵', sedan: '🚗', suv: '🚙' };

const RideCard = ({ ride, onSelect, selected }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(ride)}
      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
        selected
          ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/50 shadow-md shadow-indigo-500/10'
          : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-[#242424] hover:border-gray-200 dark:hover:border-[#333] hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Icon + info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
            selected ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-gray-100 dark:bg-[#111]'
          }`}>
            {RIDE_TYPE_ICONS[ride.rideType] || '🚗'}
          </div>
          <div>
            <p className="font-semibold text-[15px] text-gray-900 dark:text-white leading-tight">
              {ride.carType || 'Standard Sedan'}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <User size={11} />
                <span>{ride.driver?.name || 'Verified Driver'}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={11} />
                <span>{new Date(ride.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            {(ride.driver?.averageRating > 0) && (
              <div className="mt-1">
                <StarRating rating={ride.driver.averageRating} count={ride.driver.totalReviews} size="sm" />
              </div>
            )}
            <div className="flex items-center gap-1 mt-1">
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                ride.seats > 0
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                {ride.seats > 0 ? `${ride.seats} seats` : 'Full'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Price */}
        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-black text-xl text-gray-900 dark:text-white">${ride.price}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">per seat</p>
        </div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            <Zap size={11} /> Details panel opened →
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RideCard;
