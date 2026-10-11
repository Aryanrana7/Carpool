const Driver = require('../models/Driver');
const generateToken = require('../utils/generateToken');

// @desc    Register a new driver
// @route   POST /api/drivers/register
// @access  Public
const registerDriver = async (req, res) => {
  const { name, email, password, carModel, carNumber } = req.body;

  if (!name || !email || !password || !carModel || !carNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const driverExists = await Driver.findOne({ email: normalizedEmail });

    if (driverExists) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const driver = await Driver.create({
      name,
      email: normalizedEmail,
      password,
      carModel,
      carNumber,
    });

    if (driver) {
      res.status(201).json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        carModel: driver.carModel,
        carNumber: driver.carNumber,
        isAvailable: driver.isAvailable,
        token: generateToken(driver._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid driver data' });
    }
  } catch (error) {
    console.error('Driver registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth driver & get token
// @route   POST /api/drivers/login
// @access  Public
const loginDriver = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const driver = await Driver.findOne({ email: normalizedEmail });

    if (driver && (await driver.matchPassword(password))) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        carModel: driver.carModel,
        carNumber: driver.carNumber,
        isAvailable: driver.isAvailable,
        token: generateToken(driver._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Driver login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get driver profile
// @route   GET /api/drivers/profile
// @access  Private/Driver
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);

    if (driver) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        carModel: driver.carModel,
        carNumber: driver.carNumber,
        isAvailable: driver.isAvailable,
      });
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    console.error('Driver profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update driver availability (online/offline)
// @route   PUT /api/drivers/availability
// @access  Private/Driver
const updateDriverAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.driver._id,
      { isAvailable: Boolean(isAvailable) },
      { new: true }
    );
    res.json({ isAvailable: driver.isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update driver current location
// @route   PUT /api/drivers/location
// @access  Private/Driver
const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: 'Coordinates out of bounds' });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.driver._id,
      {
        currentLocation: { lat, lng },
        locationUpdatedAt: new Date(),
      },
      { new: true }
    );
    res.json({
      currentLocation: driver.currentLocation,
      locationUpdatedAt: driver.locationUpdatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverAvailability,
  updateDriverLocation,
};
