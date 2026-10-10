import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  max = 5,
  interactive = false,
  onChange,
  size = 18,
  showScore = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = displayRating >= starValue;
          const isHalf = !isFilled && displayRating >= starValue - 0.5;

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                aria-label={`Rate ${starValue} of ${max} stars`}
                onClick={() => onChange && onChange(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-transform hover:scale-110"
              >
                <Star
                  size={size}
                  className={`transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-transparent text-border dark:text-border-subtle'
                  }`}
                />
              </button>
            );
          }

          return (
            <Star
              key={index}
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-200 text-amber-400'
                  : 'fill-transparent text-border dark:text-border-subtle'
              }`}
            />
          );
        })}
      </div>

      {showScore && rating > 0 && (
        <span className="text-xs font-semibold tabular-nums text-text-primary ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
