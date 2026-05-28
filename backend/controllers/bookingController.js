const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.seats <= 0) {
      return res.status(400).json({ message: 'No seats available on this ride' });
    }

    // Check if user already booked this ride
    const existingBooking = await Booking.findOne({ user: req.user._id, ride: rideId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this ride' });
    }

    // Create booking with status "pending"
    const booking = await Booking.create({
      user: req.user._id,
      ride: rideId,
      status: 'pending',
    });

    // Decrease available seats on the ride to reserve them
    ride.seats -= 1;
    await ride.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'ride',
        select: 'source destination time price carType driver seats',
        populate: {
          path: 'driver',
          select: 'name email carModel carNumber averageRating totalReviews',
        },
      })
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed statuses are "cancelled" or "completed"
    if (status !== 'cancelled' && status !== 'completed') {
      return res.status(400).json({ message: 'Invalid status. Must be "cancelled" or "completed"' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure booking belongs to logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    // If status = "cancelled", increase ride seats by 1
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      const ride = await Ride.findById(booking.ride);
      if (ride) {
        ride.seats += 1;
        await ride.save();
      }
    }

    // Update booking status and save
    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bookings for rides created by logged in driver
// @route   GET /api/bookings/driver
// @access  Private/Driver
const getDriverBookings = async (req, res) => {
  try {
    // 1. Find all rides created by this driver
    const driverRides = await Ride.find({ driver: req.driver._id });
    const rideIds = driverRides.map(ride => ride._id);

    // 2. Find all bookings for these rides
    const bookings = await Booking.find({ ride: { $in: rideIds } })
      .populate('user', 'name email')
      .populate('ride', 'source destination time price carType')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update booking status by driver
// @route   PUT /api/bookings/:id/driver-status
// @access  Private/Driver
const updateBookingStatusDriver = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'rejected', 'cancelled', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('ride');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify the driver owns the ride
    if (booking.ride.driver.toString() !== req.driver._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    // If rejected or cancelled, return the seat
    if ((status === 'rejected' || status === 'cancelled') && booking.status !== 'rejected' && booking.status !== 'cancelled') {
      const ride = await Ride.findById(booking.ride._id);
      if (ride) {
        ride.seats += 1;
        await ride.save();
      }
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get driver stats (earnings, totals)
// @route   GET /api/bookings/driver/stats
// @access  Private/Driver
const getDriverStats = async (req, res) => {
  try {
    const driverRides = await Ride.find({ driver: req.driver._id });
    const rideIds = driverRides.map(r => r._id);

    const allBookings = await Booking.find({ ride: { $in: rideIds } })
      .populate('ride', 'price source destination time carType');

    const completed = allBookings.filter(b => b.status === 'completed');
    const totalEarnings = completed.reduce((sum, b) => sum + (b.ride?.price || 0), 0);
    const pending = allBookings.filter(b => b.status === 'pending');
    const active = allBookings.filter(b => b.status === 'in_progress' || b.status === 'confirmed');

    res.json({
      totalRides: completed.length,
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      pendingRequests: pending.length,
      activeRides: active.length,
      totalRidesOffered: driverRides.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  getDriverBookings,
  updateBookingStatusDriver,
  getDriverStats,
};
