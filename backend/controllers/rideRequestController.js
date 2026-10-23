const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { calculateFare } = require('../utils/pricingEngine');
const {
  calculateDistanceKm,
  findNearbyEligibleDrivers,
  DEFAULT_PICKUP_RADIUS_KM,
} = require('../utils/driverMatching');

// Helper to emit socket events
const emitToUser = (req, userId, event, payload) => {
  const io = req.app.get('io');
  const userSockets = req.app.get('userSockets');
  const socketId = userSockets?.get(userId.toString());
  if (io && socketId) {
    io.to(socketId).emit(event, payload);
  }
};

const emitToDriver = (req, driverId, event, payload) => {
  const io = req.app.get('io');
  const driverSockets = req.app.get('driverSockets');
  const socketId = driverSockets?.get(driverId.toString());
  if (io && socketId) {
    io.to(socketId).emit(event, payload);
  }
};

// @desc    Create on-demand ride request
// @route   POST /api/ride-requests
// @access  Private/User
const createRideRequest = async (req, res) => {
  try {
    if (!req.user || req.driver) {
      return res.status(403).json({ message: 'Only passengers can request on-demand rides' });
    }

    const {
      pickup,
      destination,
      passengerCount = 1,
      rideType = 'sedan',
      distanceKm: clientDist,
      durationMin: clientDur,
    } = req.body;

    // Validate locations
    if (!pickup?.address || !Number.isFinite(pickup.lat) || !Number.isFinite(pickup.lng)) {
      return res.status(400).json({ message: 'Valid pickup address and coordinates are required' });
    }
    if (!destination?.address || !Number.isFinite(destination.lat) || !Number.isFinite(destination.lng)) {
      return res.status(400).json({ message: 'Valid destination address and coordinates are required' });
    }
    if (pickup.lat < -90 || pickup.lat > 90 || pickup.lng < -180 || pickup.lng > 180) {
      return res.status(400).json({ message: 'Pickup coordinates out of bounds' });
    }
    if (destination.lat < -90 || destination.lat > 90 || destination.lng < -180 || destination.lng > 180) {
      return res.status(400).json({ message: 'Destination coordinates out of bounds' });
    }

    const sameAddr = pickup.address.trim().toLowerCase() === destination.address.trim().toLowerCase();
    const sameCoords = Math.abs(pickup.lat - destination.lat) < 0.0001 && Math.abs(pickup.lng - destination.lng) < 0.0001;
    if (sameAddr || sameCoords) {
      return res.status(400).json({ message: 'Pickup and destination cannot be the same' });
    }

    const countNum = parseInt(passengerCount, 10);
    if (!countNum || countNum < 1 || countNum > 6) {
      return res.status(400).json({ message: 'Passenger count must be between 1 and 6' });
    }

    // Check for existing active request
    const existingActive = await RideRequest.findOne({
      user: req.user._id,
      status: { $in: ['searching', 'accepted', 'driver_arriving', 'in_progress'] },
    }).populate('driver', 'name carModel carNumber averageRating currentLocation');

    if (existingActive) {
      // Check if it's expired
      if (existingActive.status === 'searching' && existingActive.expiresAt < new Date()) {
        existingActive.status = 'expired';
        await existingActive.save();
      } else {
        return res.status(400).json({
          message: 'You already have an active ride request in progress',
          activeRequest: existingActive,
        });
      }
    }

    // Determine distance & duration
    const dist = clientDist && Number.isFinite(Number(clientDist)) && Number(clientDist) > 0
      ? Number(clientDist)
      : Math.max(0.5, calculateDistanceKm(pickup.lat, pickup.lng, destination.lat, destination.lng));

    const dur = clientDur && Number.isFinite(Number(clientDur)) && Number(clientDur) > 0
      ? Number(clientDur)
      : Math.max(2, Math.round(dist * 2.2));

    // Calculate fare
    const fareDetails = calculateFare(dist, dur, rideType);

    // Find nearby eligible drivers (default radius: 5 km)
    const eligibleMatches = await findNearbyEligibleDrivers({
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      passengerCount: countNum,
      rideType,
      radiusKm: DEFAULT_PICKUP_RADIUS_KM,
    });

    const eligibleDriverIds = eligibleMatches.map((m) => m.driver._id);

    // Create request record (expiry 60s)
    const expiresAt = new Date(Date.now() + 60 * 1000);

    const rideRequest = await RideRequest.create({
      user: req.user._id,
      pickup: {
        address: pickup.address.trim(),
        lat: pickup.lat,
        lng: pickup.lng,
      },
      destination: {
        address: destination.address.trim(),
        lat: destination.lat,
        lng: destination.lng,
      },
      passengerCount: countNum,
      rideType,
      fare: {
        baseFare: fareDetails.baseFare,
        distanceFare: fareDetails.distanceFare,
        timeFare: fareDetails.timeFare,
        surgeMultiplier: fareDetails.surgeMultiplier,
        totalFare: fareDetails.finalPrice,
        distanceKm: fareDetails.distanceKm,
        durationMin: fareDetails.durationMin,
      },
      status: 'searching',
      notifiedDrivers: eligibleDriverIds,
      expiresAt,
    });

    // Notify all eligible drivers in real-time via Socket.io
    eligibleMatches.forEach(({ driver, distanceKm }) => {
      emitToDriver(req, driver._id, 'request:new', {
        requestId: rideRequest._id,
        pickup: rideRequest.pickup,
        destination: rideRequest.destination,
        passengerCount: rideRequest.passengerCount,
        rideType: rideRequest.rideType,
        distanceToPickup: distanceKm,
        fare: rideRequest.fare.totalFare,
        fareBreakdown: rideRequest.fare,
        expiresAt: rideRequest.expiresAt,
        passengerName: req.user.name,
      });
    });

    res.status(201).json({
      rideRequest,
      eligibleDriversFound: eligibleMatches.length,
      message: eligibleMatches.length > 0
        ? `Request sent to ${eligibleMatches.length} nearby driver(s)`
        : 'Searching for nearby drivers within 5 km...',
    });
  } catch (error) {
    console.error('Create ride request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get passenger's active on-demand request
// @route   GET /api/ride-requests/active
// @access  Private/User
const getActivePassengerRequest = async (req, res) => {
  try {
    const request = await RideRequest.findOne({
      user: req.user._id,
      status: { $in: ['searching', 'accepted', 'driver_arriving', 'in_progress'] },
    })
      .populate('driver', 'name email carModel carNumber averageRating totalReviews currentLocation locationUpdatedAt')
      .populate('booking');

    if (!request) {
      return res.json({ activeRequest: null });
    }

    // Auto-expire searching requests if past deadline
    if (request.status === 'searching' && request.expiresAt < new Date()) {
      request.status = 'expired';
      await request.save();
      return res.json({ activeRequest: null });
    }

    res.json({ activeRequest: request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get pending requests for authenticated driver
// @route   GET /api/ride-requests/driver/pending
// @access  Private/Driver
const getDriverPendingRequests = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver || !driver.isAvailable || !driver.currentLocation?.lat) {
      return res.json([]);
    }

    // Find active requests within deadline not declined by this driver
    const pendingRequests = await RideRequest.find({
      status: 'searching',
      expiresAt: { $gt: new Date() },
      declinedDrivers: { $ne: req.driver._id },
    }).populate('user', 'name');

    // Filter by 5km radius to this driver's position
    const matched = [];
    for (const r of pendingRequests) {
      const distance = calculateDistanceKm(
        driver.currentLocation.lat,
        driver.currentLocation.lng,
        r.pickup.lat,
        r.pickup.lng
      );
      if (distance <= DEFAULT_PICKUP_RADIUS_KM) {
        const obj = r.toObject();
        obj.distanceToPickup = distance;
        matched.push(obj);
      }
    }

    matched.sort((a, b) => a.distanceToPickup - b.distanceToPickup);
    res.json(matched);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Atomic acceptance of a ride request
// @route   POST /api/ride-requests/:id/accept
// @access  Private/Driver
const acceptRideRequest = async (req, res) => {
  try {
    const driverId = req.driver._id;
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Verify driver is not already handling an active on-demand ride
    const alreadyBusy = await RideRequest.findOne({
      driver: driverId,
      status: { $in: ['accepted', 'driver_arriving', 'in_progress'] },
    });
    if (alreadyBusy) {
      return res.status(400).json({
        message: 'You already have an active ride assignment in progress',
      });
    }

    // Atomic conditional claim
    const updatedRequest = await RideRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'searching',
        expiresAt: { $gt: new Date() },
        declinedDrivers: { $ne: driverId },
      },
      {
        $set: {
          status: 'accepted',
          driver: driverId,
          assignedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    ).populate('user', 'name email');

    if (!updatedRequest) {
      return res.status(409).json({
        message: 'This ride request is no longer available (already claimed or expired)',
      });
    }

    // Create synchronized scheduled/on-demand Ride & Booking records for chat & rating compatibility
    const ride = await Ride.create({
      driver: driverId,
      source: updatedRequest.pickup.address,
      destination: updatedRequest.destination.address,
      sourceCoords: {
        lat: updatedRequest.pickup.lat,
        lng: updatedRequest.pickup.lng,
      },
      destinationCoords: {
        lat: updatedRequest.destination.lat,
        lng: updatedRequest.destination.lng,
      },
      time: new Date(),
      seats: 0,
      price: updatedRequest.fare.totalFare,
      carType: driver.carModel || 'Standard',
      rideType: updatedRequest.rideType || 'sedan',
      status: 'in_progress',
    });

    const booking = await Booking.create({
      user: updatedRequest.user._id,
      ride: ride._id,
      status: 'in_progress',
      paymentStatus: 'simulated_paid',
    });

    // Link back to ride request
    updatedRequest.ride = ride._id;
    updatedRequest.booking = booking._id;
    await updatedRequest.save();

    // Distance from driver to pickup
    const pickupDist = driver.currentLocation?.lat
      ? calculateDistanceKm(
          driver.currentLocation.lat,
          driver.currentLocation.lng,
          updatedRequest.pickup.lat,
          updatedRequest.pickup.lng
        )
      : 1.2;

    // 1. Notify the passenger in real-time
    emitToUser(req, updatedRequest.user._id, 'request:driverAssigned', {
      requestId: updatedRequest._id,
      bookingId: booking._id,
      rideId: ride._id,
      driver: {
        _id: driver._id,
        name: driver.name,
        carModel: driver.carModel,
        carNumber: driver.carNumber,
        averageRating: driver.averageRating,
        totalReviews: driver.totalReviews,
        currentLocation: driver.currentLocation,
      },
      distanceToPickup: pickupDist,
      status: 'accepted',
    });

    // 2. Notify other notified drivers that this request was taken
    const io = req.app.get('io');
    const driverSockets = req.app.get('driverSockets');
    if (io && updatedRequest.notifiedDrivers?.length) {
      updatedRequest.notifiedDrivers.forEach((id) => {
        if (!id.equals(driverId)) {
          const sId = driverSockets?.get(id.toString());
          if (sId) {
            io.to(sId).emit('request:taken', { requestId: updatedRequest._id });
          }
        }
      });
    }

    res.json({
      message: 'Ride accepted successfully',
      rideRequest: updatedRequest,
      bookingId: booking._id,
      rideId: ride._id,
      passenger: {
        name: updatedRequest.user.name,
      },
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Decline a ride request
// @route   POST /api/ride-requests/:id/decline
// @access  Private/Driver
const declineRideRequest = async (req, res) => {
  try {
    const driverId = req.driver._id;
    const request = await RideRequest.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { declinedDrivers: driverId } },
      { returnDocument: 'after' }
    );

    if (!request) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    res.json({ message: 'Request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update ride request lifecycle status (driver_arriving, in_progress, completed)
// @route   PUT /api/ride-requests/:id/status
// @access  Private/Driver
const updateRideRequestStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    const allowed = ['driver_arriving', 'in_progress', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status transition: ${status}` });
    }

    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (!request.driver || !request.driver.equals(req.driver._id)) {
      return res.status(403).json({ message: 'Not authorized for this ride request' });
    }

    // Validate lifecycle sequence
    const transitions = {
      accepted: ['driver_arriving', 'in_progress'],
      driver_arriving: ['in_progress', 'completed'],
      in_progress: ['completed'],
    };

    if (!transitions[request.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition request from "${request.status}" to "${status}"`,
      });
    }

    request.status = status;
    if (status === 'in_progress') {
      request.startedAt = new Date();
    } else if (status === 'completed') {
      request.completedAt = new Date();
    }
    await request.save();

    // Synchronize linked booking and ride if present
    if (request.booking) {
      const bookingStatus = status === 'completed' ? 'completed' : 'in_progress';
      await Booking.findByIdAndUpdate(request.booking, { status: bookingStatus });
    }
    if (request.ride && status === 'completed') {
      await Ride.findByIdAndUpdate(request.ride, { status: 'completed' });
    }

    // Emit status update to passenger
    emitToUser(req, request.user, 'request:statusUpdate', {
      requestId: request._id,
      status,
      bookingId: request.booking,
    });

    res.json({ message: `Status updated to ${status}`, rideRequest: request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel a ride request
// @route   PUT /api/ride-requests/:id/cancel
// @access  Private (Passenger or Assigned Driver)
const cancelRideRequest = async (req, res) => {
  try {
    const { reason = 'Cancelled by user' } = req.body || {};
    const request = await RideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    // If request is already cancelled or expired, resolve gracefully with 200
    if (request.status === 'cancelled' || request.status === 'expired') {
      return res.json({
        message: `Ride request is already ${request.status}`,
        rideRequest: request,
      });
    }

    // Auto-expire searching requests that are past deadline
    if (
      request.status === 'searching' &&
      request.expiresAt &&
      new Date(request.expiresAt).getTime() < Date.now()
    ) {
      request.status = 'expired';
      await request.save();
      return res.json({
        message: 'Ride request has expired',
        rideRequest: request,
      });
    }

    const requestUserId = request.user?._id ? request.user._id.toString() : request.user?.toString();
    const currentUserId = req.user?._id ? req.user._id.toString() : req.user?.toString();
    const requestDriverId = request.driver?._id ? request.driver._id.toString() : request.driver?.toString();
    const currentDriverId = req.driver?._id ? req.driver._id.toString() : req.driver?.toString();

    let isPassenger = Boolean(currentUserId && requestUserId && requestUserId === currentUserId);
    let isDriver = Boolean(currentDriverId && requestDriverId && requestDriverId === currentDriverId);

    // If driver token was sent from the same person (matched email)
    if (!isPassenger && req.driver && request.user) {
      const passengerUser = await User.findById(request.user);
      if (
        passengerUser &&
        req.driver.email &&
        passengerUser.email &&
        passengerUser.email.toLowerCase() === req.driver.email.toLowerCase()
      ) {
        isPassenger = true;
      }
    }

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Not authorized to cancel this ride request' });
    }

    if (request.status === 'in_progress' || request.status === 'completed') {
      return res.status(400).json({
        message: 'Cannot cancel a ride that is already in progress or completed',
      });
    }

    const actor = isPassenger ? 'user' : 'driver';
    request.status = 'cancelled';
    request.cancelledAt = new Date();
    request.cancelledBy = actor;
    request.cancellationReason = reason;
    await request.save();

    if (request.booking) {
      await Booking.findByIdAndUpdate(request.booking, { status: 'cancelled' });
    }
    if (request.ride) {
      await Ride.findByIdAndUpdate(request.ride, { status: 'cancelled' });
    }

    // Notify the other party
    if (isPassenger && request.driver) {
      emitToDriver(req, request.driver, 'request:statusUpdate', {
        requestId: request._id,
        status: 'cancelled',
        reason,
      });
    } else if (isDriver) {
      emitToUser(req, request.user, 'request:statusUpdate', {
        requestId: request._id,
        status: 'cancelled',
        reason,
      });
    }

    res.json({ message: 'Ride request cancelled', rideRequest: request });
  } catch (error) {
    console.error('Cancel ride request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single ride request by ID
// @route   GET /api/ride-requests/:id
// @access  Private (Passenger or Notified/Assigned Driver)
const getRideRequestById = async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id)
      .populate('driver', 'name email carModel carNumber averageRating totalReviews currentLocation')
      .populate('user', 'name email')
      .populate('booking');

    if (!request) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    const requestUserId = request.user?._id ? request.user._id.toString() : request.user?.toString();
    const currentUserId = req.user?._id ? req.user._id.toString() : req.user?.toString();
    const requestDriverId = request.driver?._id ? request.driver._id.toString() : request.driver?.toString();
    const currentDriverId = req.driver?._id ? req.driver._id.toString() : req.driver?.toString();

    let isPassenger = Boolean(currentUserId && requestUserId && requestUserId === currentUserId);
    let isAssignedDriver = Boolean(currentDriverId && requestDriverId && requestDriverId === currentDriverId);
    let isNotifiedDriver = Boolean(
      currentDriverId &&
      request.notifiedDrivers?.some((d) => (d?._id ? d._id.toString() : d?.toString()) === currentDriverId)
    );

    if (!isPassenger && req.driver && request.user?.email && req.driver.email) {
      if (request.user.email.toLowerCase() === req.driver.email.toLowerCase()) {
        isPassenger = true;
      }
    }

    if (!isPassenger && !isAssignedDriver && !isNotifiedDriver) {
      return res.status(403).json({ message: 'Not authorized to view this ride request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRideRequest,
  getActivePassengerRequest,
  getDriverPendingRequests,
  acceptRideRequest,
  declineRideRequest,
  updateRideRequestStatus,
  cancelRideRequest,
  getRideRequestById,
};
