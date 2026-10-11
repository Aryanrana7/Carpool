import React from 'react';

/**
 * Authentic CarPool brand logo: two-person mobility emblem.
 * - Left figure: Primary Teal (#087F5B)
 * - Right figure: Accent Amber (#E8A45B) overlapping the left shoulder
 * Scalable SVG with high-DPI crisp rendering.
 */
export const CarPoolLogo = ({
  className = 'h-7 sm:h-8 w-auto',
  tealColor = '#087F5B',
  amberColor = '#E8A45B',
  title = 'CarPool logo',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 247 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
      role="img"
      {...props}
    >
      <title>{title}</title>
      
      {/* Left Person — Primary Teal (#087F5B) */}
      <circle
        cx="71"
        cy="33.5"
        r="33.5"
        fill={tealColor}
      />
      <path
        d="M 14.5 169.5 L 14.5 155 C 14.5 125 40 115.5 71 115.5 C 102 115.5 127.5 125 127.5 155"
        stroke={tealColor}
        strokeWidth="29"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right Person — Accent Amber (#E8A45B) overlapping the left figure */}
      <circle
        cx="175"
        cy="33.5"
        r="33.5"
        fill={amberColor}
      />
      <path
        d="M 122.5 140.5 C 127.5 125 144 115.5 175 115.5 C 206 115.5 231.5 125 231.5 155 L 231.5 169.5"
        stroke={amberColor}
        strokeWidth="29"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default CarPoolLogo;
