import React from 'react';

const Shimmer = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

const StatCardSkeleton = () => (
  <div className="card p-5 min-h-[130px] flex flex-col justify-between animate-pulse">
    <div className="flex justify-between">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <Shimmer className="w-14 h-5 rounded-full" />
    </div>
    <div className="space-y-2 mt-4">
      <Shimmer className="w-20 h-7" />
      <Shimmer className="w-28 h-3" />
    </div>
  </div>
);

const BookingCardSkeleton = () => (
  <div className="card p-4 animate-pulse space-y-3">
    <div className="flex justify-between">
      <div className="flex items-center gap-3">
        <Shimmer className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Shimmer className="w-24 h-4" />
          <Shimmer className="w-32 h-3" />
        </div>
      </div>
      <Shimmer className="w-16 h-5 rounded-full" />
    </div>
    <Shimmer className="w-full h-14 rounded-xl" />
    <div className="flex gap-2">
      <Shimmer className="flex-1 h-9 rounded-xl" />
      <Shimmer className="flex-1 h-9 rounded-xl" />
    </div>
  </div>
);

export { Shimmer, StatCardSkeleton, BookingCardSkeleton };
