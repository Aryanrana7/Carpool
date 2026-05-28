const Ride = require('../models/Ride');

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res) => {
  try {
    const { source, destination, time, seats, price, carType } = req.body;

    // Validate required fields
    if (!source || !destination || !time || !seats || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate seats
    if (seats <= 0) {
      return res.status(400).json({ message: 'Seats must be greater than 0' });
    }

    // Create the ride
    const ride = await Ride.create({
      driver: req.driver._id,
      source,
      destination,
      time,
      seats,
      price,
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

// @desc    Search rides
// @route   GET /api/rides/search
// @access  Public
const searchRides = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    // Default query: seats > 0 and ride time is in the future
    let query = {
      seats: { $gt: 0 },
      time: { $gte: new Date() }
    };

    // Case-insensitive partial match for source
    if (source) {
      query.source = { $regex: new RegExp(source, 'i') };
    }

    // Case-insensitive partial match for destination
    if (destination) {
      query.destination = { $regex: new RegExp(destination, 'i') };
    }

    // Filter by specific date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query.time = {
        $gte: Math.max(startDate.getTime(), new Date().getTime()), // Ensure we don't show past rides on that date
        $lt: endDate,
      };
    }

    // Sort by nearest time (ascending order)
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
