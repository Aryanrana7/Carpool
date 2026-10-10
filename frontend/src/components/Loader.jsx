import React from 'react';

const Loader = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-8 h-8 border-3' : 'w-6 h-6 border-2';
  return (
    <div className="flex justify-center items-center py-2">
      <div className={`${dim} border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  );
};

export default Loader;
