import React from 'react';
import { Star, ShieldCheck, Car } from 'lucide-react';

/**
 * TrustStrip renders a trust-first driver credibility strip:
 * Driver avatar, name, rating score (with verified review count), and vehicle info.
 * Strictly surfaces real data from the database. Hides fields that have no data.
 */
export const TrustStrip = ({
  driver = {},
  size = 'md',
  className = '',
  showVehicle = true,
}) => {
  const name = driver?.name || 'Driver';
  const initial = name.charAt(0).toUpperCase();
  const rating = Number(driver?.averageRating);
  const reviewsCount = Number(driver?.totalReviews || 0);
  const hasRating = reviewsCount > 0 && !isNaN(rating) && rating > 0;
  const carModel = driver?.carModel;
  const carNumber = driver?.carNumber;
  const isVerified = Boolean(driver?.isVerified);

  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Driver Avatar */}
      <div
        className={`
          rounded-full bg-primary-subtle text-primary font-heading font-bold flex items-center justify-center shrink-0 border border-primary/20
          ${isSmall ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}
        `}
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* Driver Credibility Details */}
      <div className="min-w-0 flex-1">
        {/* Name & Rating Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-semibold text-text-primary truncate ${isSmall ? 'text-xs' : 'text-sm'}`}>
            {name}
          </p>

          {/* Rating */}
          {hasRating ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-text-primary font-heading tabular-nums shrink-0">
              <Star size={12} className="fill-amber-400 text-amber-500" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-[10px] text-text-muted font-normal">({reviewsCount})</span>
            </div>
          ) : (
            <span className="text-[10px] font-medium text-text-muted px-1.5 py-0.5 rounded bg-border-subtle shrink-0">
              New driver
            </span>
          )}

          {/* Real verified badge ONLY if verified property exists */}
          {isVerified && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary bg-primary-subtle px-1.5 py-0.5 rounded shrink-0"
              title="Verified Driver Identity"
            >
              <ShieldCheck size={11} />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Vehicle Row (if data exists and requested) */}
        {showVehicle && (carModel || carNumber) && (
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted truncate mt-0.5">
            <Car size={12} className="shrink-0 text-text-muted" />
            <span className="truncate">
              {carModel || 'Standard Vehicle'}
              {carNumber ? ` · ${carNumber}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrustStrip;
