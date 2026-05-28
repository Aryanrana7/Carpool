import React from 'react';
import { Star } from 'lucide-react';

/**
 * Reusable star-rating display component.
 * @param {number} rating  - 0–5
 * @param {number} count   - total review count (optional)
 * @param {string} size    - 'sm' | 'md' | 'lg'
 */
const StarRating = ({ rating = 0, count, size = 'sm' }) => {
  const sizes = { sm: 12, md: 16, lg: 20 };
  const px = sizes[size] ?? 12;
  const rounded = Math.round(rating * 10) / 10;

  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={px}
          className={
            star <= Math.round(rounded)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 dark:text-gray-700'
          }
        />
      ))}
      {rounded > 0 && (
        <span className={`font-bold text-gray-700 dark:text-gray-300 ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
          {rounded.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-gray-400 dark:text-gray-500 text-xs">({count})</span>
      )}
    </span>
  );
};

export default StarRating;
