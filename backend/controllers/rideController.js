const Ride = require('../models/Ride');

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res) => {
  try {
    const { source, destination, sourceCoords, destinationCoords, time, seats, price, carType } = req.body;

    // Validate required fields
    if (!source || !destination || !time || !seats || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate seats
    if (seats <= 0) {
      return res.status(400).json({ message: 'Seats must be greater than 0' });
    }

    // Create the ride
    const finalPrice = Number(price);
    const ride = await Ride.create({
      driver: req.driver._id,
      source,
      destination,
      sourceCoords,
      destinationCoords,
      time,
      seats,
      price: finalPrice,
      priceBreakdown: {
        baseFare: parseFloat((finalPrice * 0.65).toFixed(2)),
        distanceFare: parseFloat((finalPrice * 0.25).toFixed(2)),
        timeFare: parseFloat((finalPrice * 0.10).toFixed(2)),
        surgeMultiplier: 1.0,
        distanceKm: 0,
        durationMin: 0,
      },
      carType: carType || req.driver.carModel || 'Standard',
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get rides created by logged in driver
// @route   GET /api/rides/driver
// @access  Private/Driver
const getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.driver._id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all rides
// @route   GET /api/rides
// @access  Public
const getRides = async (req, res) => {
  try {
    // Populate driver info (name, rating) from the User model
    const rides = await Ride.find({}).populate('driver', 'name averageRating totalReviews carModel carNumber');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ride by ID
// @route   GET /api/rides/:id
// @access  Public
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name averageRating totalReviews email carModel carNumber');
    
    if (ride) {
      res.json(ride);
    } else {
      res.status(404).json({ message: 'Ride not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Build a clean, precise regex for route matching
const buildLocationRegex = (locationQuery) => {
  if (!locationQuery || typeof locationQuery !== 'string') return null;
  const trimmed = locationQuery.trim();
  if (!trimmed) return null;

  // Extract primary name before comma (e.g., "Chandigarh, India" -> "Chandigarh")
  const primaryName = trimmed.split(',')[0].trim();
  const escapedExact = escapeRegex(trimmed);
  const escapedPrimary = escapeRegex(primaryName);

  return new RegExp(`(?:^|\\b)(?:${escapedExact}|${escapedPrimary})(?:\\b|$)`, 'i');
};

// @desc    Search rides
// @route   GET /api/rides/search
// @access  Public
const searchRides = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    // Filter only active rides with available seats and future departure time
    let query = {
      status: 'active',
      seats: { $gt: 0 },
      time: { $gte: new Date() },
    };

    if (source && typeof source === 'string' && source.trim()) {
      const sourceRegex = buildLocationRegex(source);
      if (sourceRegex) {
        query.source = { $regex: sourceRegex };
      }
    }

    if (destination && typeof destination === 'string' && destination.trim()) {
      const destRegex = buildLocationRegex(destination);
      if (destRegex) {
        query.destination = { $regex: destRegex };
      }
    }

    // Filter by specific date if provided
    if (date) {
      const startDate = new Date(date);
      if (!isNaN(startDate.getTime())) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        query.time = {
          $gte: new Date(Math.max(startDate.getTime(), Date.now())),
          $lt: endDate,
        };
      }
    }

    // Sort by nearest departure time (ascending order)
    const rides = await Ride.find(query)
      .sort({ time: 1 })
      .populate('driver', 'name averageRating totalReviews carModel carNumber');

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  searchRides,
  getDriverRides,
};
