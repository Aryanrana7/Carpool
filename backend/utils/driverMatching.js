const Driver = require('../models/Driver');
const RideRequest = require('../models/RideRequest');

const DEFAULT_PICKUP_RADIUS_KM = 5.0;
const MAX_STALE_LOCATION_MINUTES = 60; // 60 minutes for demo/testing tolerance

/**
 * Calculates Great-Circle distance in kilometers between two points using the Haversine formula
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon2)
  ) {
    return Infinity;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Finds eligible nearby drivers for an on-demand ride request
 * @param {object} params
 * @param {number} params.pickupLat - Pickup latitude
 * @param {number} params.pickupLng - Pickup longitude
 * @param {number} [params.passengerCount=1] - Requested passenger seats
 * @param {string} [params.rideType='sedan'] - mini | sedan | suv
 * @param {Array<string>} [params.excludedDriverIds=[]] - Drivers who declined or were already tried
 * @param {number} [params.radiusKm=5.0] - Maximum search radius
 * @returns {Promise<Array<object>>} - List of eligible drivers with distance
 */
async function findNearbyEligibleDrivers({
  pickupLat,
  pickupLng,
  passengerCount = 1,
  rideType = 'sedan',
  excludedDriverIds = [],
  radiusKm = DEFAULT_PICKUP_RADIUS_KM,
}) {
  // 1. Find busy drivers with active on-demand requests
  const busyRequests = await RideRequest.find({
    status: { $in: ['accepted', 'driver_arriving', 'in_progress'] },
    driver: { $ne: null },
  }).select('driver');

  const busyDriverIds = busyRequests
    .map((r) => r.driver?.toString())
    .filter(Boolean);

  // Combine busy and excluded driver IDs
  const allExcluded = new Set([
    ...busyDriverIds,
    ...excludedDriverIds.map((id) => id?.toString()),
  ]);

  // 2. Query available drivers with existing coordinates
  const candidateDrivers = await Driver.find({
    isAvailable: true,
    'currentLocation.lat': { $ne: null },
    'currentLocation.lng': { $ne: null },
  }).select(
    'name email carModel carNumber currentLocation locationUpdatedAt averageRating totalReviews isAvailable'
  );

  const staleCutoff = new Date(
    Date.now() - MAX_STALE_LOCATION_MINUTES * 60 * 1000
  );

  // 3. Filter candidates by radius, staleness, exclusion, and capacity
  const eligibleDrivers = [];

  for (const driver of candidateDrivers) {
    if (allExcluded.has(driver._id.toString())) {
      continue;
    }

    // Capacity check: mini: up to 3, sedan: up to 4, suv: up to 6
    if (rideType === 'suv' && passengerCount > 4) {
      const model = (driver.carModel || '').toLowerCase();
      // If requested > 4 passengers, ensure car model isn't compact
      if (model.includes('nano') || model.includes('mini')) {
        continue;
      }
    }

    // Check location staleness if locationUpdatedAt is recorded
    if (driver.locationUpdatedAt && driver.locationUpdatedAt < staleCutoff) {
      continue;
    }

    const distance = calculateDistanceKm(
      pickupLat,
      pickupLng,
      driver.currentLocation.lat,
      driver.currentLocation.lng
    );

    if (distance <= radiusKm) {
      eligibleDrivers.push({
        driver,
        distanceKm: distance,
      });
    }
  }

  // Sort closest first
  eligibleDrivers.sort((a, b) => a.distanceKm - b.distanceKm);

  return eligibleDrivers;
}

module.exports = {
  calculateDistanceKm,
  findNearbyEligibleDrivers,
  DEFAULT_PICKUP_RADIUS_KM,
};
