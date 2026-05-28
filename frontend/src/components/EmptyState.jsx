import React from 'react';
import { Car } from 'lucide-react';

const EmptyState = ({ message = "Search to see available rides." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400 dark:text-gray-500">
      <div className="w-24 h-24 bg-gray-100 dark:bg-[#111] rounded-full flex items-center justify-center mb-6">
        <Car size={48} className="opacity-20" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Rides Found</h3>
      <p className="text-sm text-center max-w-[200px]">{message}</p>
    </div>
  );
};

export default EmptyState;
