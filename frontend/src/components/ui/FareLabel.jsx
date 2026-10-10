import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * FareLabel displays ride fares as the prominent, strongest decision factor on cards.
 * Uses Manrope geometric typography, tabular numerals, and INR formatting.
 */
export const FareLabel = ({
  amount = 0,
  size = 'md',
  perSeat = false,
  highlight = false,
  className = '',
}) => {
  const formatted = formatCurrency(amount);

  const SIZE_CLASSES = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    hero: 'text-2xl sm:text-3xl',
  };

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div className={`inline-flex items-baseline gap-1 ${className}`}>
      <span
        className={`
          font-heading font-extrabold tracking-tight tabular-nums
          ${highlight ? 'text-accent-text dark:text-accent' : 'text-text-primary'}
          ${sizeClass}
        `}
      >
        {formatted}
      </span>
      {perSeat && (
        <span className="text-[11px] font-medium text-text-muted select-none">
          /seat
        </span>
      )}
    </div>
  );
};

export default FareLabel;
