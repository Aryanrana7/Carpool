const express = require('express');
const router = express.Router();
const { calculateAllFares } = require('../utils/pricingEngine');
const axios = require('axios');

// @desc    Get smart pricing for a route via OSRM
// @route   GET /api/pricing/calculate?srcLat=&srcLng=&dstLat=&dstLng=
// @access  Public
router.get('/calculate', async (req, res) => {
  const { srcLat, srcLng, dstLat, dstLng } = req.query;

  if (!srcLat || !srcLng || !dstLat || !dstLng) {
    return res.status(400).json({ message: 'Source and destination coordinates are required' });
  }

  const lat1 = parseFloat(srcLat);
  const lng1 = parseFloat(srcLng);
  const lat2 = parseFloat(dstLat);
  const lng2 = parseFloat(dstLng);

  if (
    Number.isNaN(lat1) || Number.isNaN(lng1) || Number.isNaN(lat2) || Number.isNaN(lng2) ||
    lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 ||
    lng1 < -180 || lng1 > 180 || lng2 < -180 || lng2 > 180
  ) {
    return res.status(400).json({ message: 'Invalid source or destination coordinates' });
  }

  try {
    // Query OSRM for real distance and duration
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`;
    const osrmRes = await axios.get(osrmUrl);

    if (osrmRes.data.code !== 'Ok' || !osrmRes.data.routes[0]) {
      return res.status(400).json({ message: 'Could not calculate route' });
    }

    const route = osrmRes.data.routes[0];
    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;

    // Get pricing for all ride types
    const fares = calculateAllFares(distanceKm, durationMin);

    res.json({
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      durationMin: parseFloat(durationMin.toFixed(1)),
      fares,
    });
  } catch (error) {
    console.error('Pricing error:', error.message);
    res.status(500).json({ message: 'Failed to calculate pricing' });
  }
});

module.exports = router;
