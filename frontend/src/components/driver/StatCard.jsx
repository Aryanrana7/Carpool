import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
  emerald: { icon: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500', trend: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' },
  blue:    { icon: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500',         trend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600' },
  violet:  { icon: 'bg-violet-50 dark:bg-violet-500/10 text-violet-500',   trend: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600' },
  amber:   { icon: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',      trend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' },
};

const StatCard = ({ icon: Icon, label, value, sub, trend, color = 'emerald', children }) => {
  const c = COLOR_MAP[color] || COLOR_MAP.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card p-5 flex flex-col justify-between min-h-[130px] transition-all duration-200 hover:shadow-md dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl ${c.icon}`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-1">
          {children}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${c.trend}`}>
              {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
