import React from 'react';
import { Car } from 'lucide-react';

const EmptyState = ({ message = "Search to view matching routes." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center mb-3 text-text-muted">
        <Car size={22} />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">No Rides Found</h3>
      <p className="text-xs text-center max-w-[220px] text-text-muted leading-relaxed">{message}</p>
    </div>
  );
};

export default EmptyState;
