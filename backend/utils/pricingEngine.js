// Smart Pricing utility
// Formula: price = baseFare + (distance × ratePerKm) + (duration × ratePerMin)
// finalPrice = price × surgeMultiplier

const RIDE_TYPES = {
  mini: { baseFare: 2.0, ratePerKm: 0.6, ratePerMin: 0.08, label: 'Mini' },
  sedan: { baseFare: 3.5, ratePerKm: 0.9, ratePerMin: 0.12, label: 'Sedan' },
  suv: { baseFare: 5.0, ratePerKm: 1.3, ratePerMin: 0.18, label: 'SUV' },
};

/**
 * Determines the surge multiplier based on peak hours and random demand
 */
const getSurgeMultiplier = () => {
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
  
  if (isPeakHour) {
    // Surge between 1.3x and 2.0x during peak hours
    return parseFloat((1.3 + Math.random() * 0.7).toFixed(2));
  }
  // Off-peak: light random surge between 1.0x and 1.2x
  return parseFloat((1.0 + Math.random() * 0.2).toFixed(2));
};

/**
 * Calculates fare breakdown for a given distance, duration, and rideType
 * @param {number} distanceKm - distance in km (from OSRM)
 * @param {number} durationMin - duration in minutes (from OSRM)
 * @param {string} rideType - 'mini' | 'sedan' | 'suv'
 * @returns {object} Full pricing breakdown
 */
const calculateFare = (distanceKm, durationMin, rideType = 'sedan') => {
  const config = RIDE_TYPES[rideType] || RIDE_TYPES.sedan;
  const surgeMultiplier = getSurgeMultiplier();

  const baseFare = config.baseFare;
  const distanceFare = distanceKm * config.ratePerKm;
  const timeFare = durationMin * config.ratePerMin;
  const subtotal = baseFare + distanceFare + timeFare;
  const finalPrice = parseFloat((subtotal * surgeMultiplier).toFixed(2));

  return {
    rideType,
    rideLabel: config.label,
    baseFare: parseFloat(baseFare.toFixed(2)),
    distanceFare: parseFloat(distanceFare.toFixed(2)),
    timeFare: parseFloat(timeFare.toFixed(2)),
    surgeMultiplier,
    subtotal: parseFloat(subtotal.toFixed(2)),
    finalPrice,
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    durationMin: parseFloat(durationMin.toFixed(1)),
    isPeakHour: surgeMultiplier > 1.2,
  };
};

/**
 * Returns pricing for all ride types at once
 */
const calculateAllFares = (distanceKm, durationMin) => {
  return Object.keys(RIDE_TYPES).map(type =>
    calculateFare(distanceKm, durationMin, type)
  );
};

module.exports = { calculateFare, calculateAllFares, RIDE_TYPES };
