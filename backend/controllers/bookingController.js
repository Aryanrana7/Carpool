const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const {
  ACTIVE_BOOKING_STATUSES,
  canDriverTransition,
  canPassengerCancel,
  shouldReleaseSeat,
  releaseSeat,
  syncRideStatus,
} = require('../utils/bookingStatus');

const createBooking = async (req, res) => {
  try {
    const { rideId } = req.body;

    const existingBooking = await Booking.findOne({
      user: req.user._id,
      ride: rideId,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this ride' });
    }

    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, seats: { $gt: 0 } },
      { $inc: { seats: -1 } },
      { new: true }
    );

    if (!ride) {
      const exists = await Ride.findById(rideId);
      if (!exists) {
        return res.status(404).json({ message: 'Ride not found' });
      }
      return res.status(400).json({ message: 'No seats available on this ride' });
    }

    try {
      const booking = await Booking.create({
        user: req.user._id,
        ride: rideId,
        status: 'pending',
      });
      await syncRideStatus(rideId);
      return res.status(201).json(booking);
    } catch (error) {
      await Ride.findByIdAndUpdate(rideId, { $inc: { seats: 1 } });
      if (error.code === 11000) {
        return res.status(400).json({ message: 'You have already booked this ride' });
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'ride',
        select: 'source destination time price carType driver seats status',
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

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (status !== 'cancelled') {
      return res.status(400).json({
        message: 'Passengers can only cancel a booking. Completing a trip is driver-only.',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    if (!canPassengerCancel(booking.status)) {
      return res.status(400).json({
        message: 'Booking can only be cancelled while pending or confirmed',
      });
    }

    if (shouldReleaseSeat(booking.status, status)) {
      await releaseSeat(booking.ride);
    }

    booking.status = status;
    await booking.save();
    await syncRideStatus(booking.ride);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDriverBookings = async (req, res) => {
  try {
    const driverRides = await Ride.find({ driver: req.driver._id });
    const rideIds = driverRides.map((ride) => ride._id);

    const bookings = await Booking.find({ ride: { $in: rideIds } })
      .populate('user', 'name email')
      .populate('ride', 'source destination time price carType status')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatusDriver = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate('ride');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.ride.driver.toString() !== req.driver._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    if (!canDriverTransition(booking.status, status)) {
      return res.status(400).json({
        message: `Cannot change booking from "${booking.status}" to "${status}"`,
      });
    }

    if (shouldReleaseSeat(booking.status, status)) {
      await releaseSeat(booking.ride._id);
    }

    booking.status = status;
    await booking.save();
    await syncRideStatus(booking.ride._id);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDriverStats = async (req, res) => {
  try {
    const driverRides = await Ride.find({ driver: req.driver._id });
    const rideIds = driverRides.map((r) => r._id);

    const allBookings = await Booking.find({ ride: { $in: rideIds } }).populate(
      'ride',
      'price source destination time carType'
    );

    const completed = allBookings.filter((b) => b.status === 'completed');
    const totalEarnings = completed.reduce((sum, b) => sum + (b.ride?.price || 0), 0);
    const pending = allBookings.filter((b) => b.status === 'pending');
    const active = allBookings.filter((b) => b.status === 'in_progress' || b.status === 'confirmed');

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
