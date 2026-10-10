import React from 'react';

export const Skeleton = ({
  className = '',
  circle = false,
  width,
  height,
}) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`
        animate-pulse bg-border-subtle
        ${circle ? 'rounded-full' : 'rounded-md'}
        ${className}
      `}
    />
  );
};

export default Skeleton;
