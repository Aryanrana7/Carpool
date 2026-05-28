const Driver = require('../models/Driver');
const generateToken = require('../utils/generateToken');

// @desc    Register a new driver
// @route   POST /api/drivers/register
// @access  Public
const registerDriver = async (req, res) => {
  const { name, email, password, carModel, carNumber } = req.body;

  try {
    const driverExists = await Driver.findOne({ email });

    if (driverExists) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const driver = await Driver.create({
      name,
      email,
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth driver & get token
// @route   POST /api/drivers/login
// @access  Public
const loginDriver = async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await Driver.findOne({ email });

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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  getDriverProfile,
};
