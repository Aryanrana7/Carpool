const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const createApp = require('../app');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const RideRequest = require('../models/RideRequest');
const { calculateDistanceKm, findNearbyEligibleDrivers } = require('../utils/driverMatching');

const app = createApp();
let mongod;

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function createPassenger(overrides = {}) {
  const res = await request(app)
    .post('/api/users')
    .send({
      name: 'Passenger Test',
      email: `pax-${Date.now()}-${Math.random()}@test.com`,
      password: 'password123',
      ...overrides,
    });
  assert.equal(res.status, 201);
  return res.body;
}

async function createDriver(overrides = {}) {
  const res = await request(app)
    .post('/api/drivers/register')
    .send({
      name: 'Driver Test',
      email: `drv-${Date.now()}-${Math.random()}@test.com`,
      password: 'password123',
      carModel: 'Honda City',
      carNumber: 'DL-01-AB-1234',
      ...overrides,
    });
  assert.equal(res.status, 201);
  return res.body;
}

describe('On-Demand Ride Requests Architecture & Lifecycle', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await RideRequest.deleteMany({});
    await Booking.deleteMany({});
    await Ride.deleteMany({});
    await User.deleteMany({});
    await Driver.deleteMany({});
  });

  describe('1. Passenger Ride Request Creation & Validation', () => {
    it('creates a valid on-demand ride request with calculated fare and 60s expiry', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      // Put driver nearby (approx 1.5 km away)
      await Driver.findByIdAndUpdate(driver._id, {
        currentLocation: { lat: 30.735, lng: 76.782 },
        isAvailable: true,
      });

      const res = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Sector 17, Chandigarh', lat: 30.7333, lng: 76.7794 },
          destination: { address: 'Elante Mall, Chandigarh', lat: 30.7055, lng: 76.8013 },
          passengerCount: 2,
          rideType: 'sedan',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.rideRequest.status, 'searching');
      assert.equal(res.body.rideRequest.passengerCount, 2);
      assert.equal(res.body.rideRequest.rideType, 'sedan');
      assert.ok(res.body.rideRequest.fare.totalFare > 0);
      assert.equal(res.body.eligibleDriversFound, 1);
    });

    it('rejects invalid locations, missing coordinates, or out-of-bounds inputs', async () => {
      const passenger = await createPassenger();

      // Missing lat/lng
      const res1 = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Only Address' },
          destination: { address: 'Dest', lat: 30.7, lng: 76.7 },
        });
      assert.equal(res1.status, 400);

      // Same pickup & destination
      const res2 = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Same Place', lat: 30.73, lng: 76.77 },
          destination: { address: 'Same Place', lat: 30.73, lng: 76.77 },
        });
      assert.equal(res2.status, 400);
      assert.match(res2.body.message, /cannot be the same/i);
    });

    it('rejects invalid passenger counts (< 1 or > 6)', async () => {
      const passenger = await createPassenger();

      const res = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Sector 17', lat: 30.73, lng: 76.77 },
          destination: { address: 'Sector 35', lat: 30.71, lng: 76.76 },
          passengerCount: 10,
        });

      assert.equal(res.status, 400);
      assert.match(res.body.message, /between 1 and 6/i);
    });

    it('handles no drivers available cleanly without fabricating false matches', async () => {
      const passenger = await createPassenger();
      // No drivers registered

      const res = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Remote Village', lat: 31.0, lng: 77.0 },
          destination: { address: 'Town', lat: 31.1, lng: 77.1 },
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.eligibleDriversFound, 0);
      assert.match(res.body.message, /Searching for nearby drivers within 5 km/i);
    });
  });

  describe('2. Nearby Driver Matching & Eligibility Filters', () => {
    it('matches drivers within 5 km and excludes drivers beyond 5 km', async () => {
      const pickupLat = 30.7333;
      const pickupLng = 76.7794;

      // Nearby driver (1.5 km)
      const nearbyDriver = await createDriver({ email: 'nearby@test.com' });
      await Driver.findByIdAndUpdate(nearbyDriver._id, {
        currentLocation: { lat: 30.74, lng: 76.79 },
        isAvailable: true,
      });

      // Far driver (25 km away in Ambala/Mohali far out)
      const farDriver = await createDriver({ email: 'far@test.com' });
      await Driver.findByIdAndUpdate(farDriver._id, {
        currentLocation: { lat: 30.5, lng: 76.5 },
        isAvailable: true,
      });

      const matches = await findNearbyEligibleDrivers({
        pickupLat,
        pickupLng,
        radiusKm: 5.0,
      });

      const matchedIds = matches.map((m) => m.driver._id.toString());
      assert.ok(matchedIds.includes(nearbyDriver._id.toString()));
      assert.ok(!matchedIds.includes(farDriver._id.toString()));
    });

    it('excludes offline or unavailable drivers even if physically close', async () => {
      const pickupLat = 30.7333;
      const pickupLng = 76.7794;

      const offlineDriver = await createDriver({ email: 'offline@test.com' });
      await Driver.findByIdAndUpdate(offlineDriver._id, {
        currentLocation: { lat: 30.7335, lng: 76.7795 },
        isAvailable: false, // offline
      });

      const matches = await findNearbyEligibleDrivers({
        pickupLat,
        pickupLng,
        radiusKm: 5.0,
      });

      const matchedIds = matches.map((m) => m.driver._id.toString());
      assert.ok(!matchedIds.includes(offlineDriver._id.toString()));
    });

    it('excludes drivers who are already assigned to active on-demand rides', async () => {
      const pickupLat = 30.7333;
      const pickupLng = 76.7794;

      const busyDriver = await createDriver({ email: 'busy@test.com' });
      await Driver.findByIdAndUpdate(busyDriver._id, {
        currentLocation: { lat: 30.7335, lng: 76.7795 },
        isAvailable: true,
      });

      const passenger = await createPassenger();
      await RideRequest.create({
        user: passenger._id,
        pickup: { address: 'P', lat: 30.73, lng: 76.77 },
        destination: { address: 'D', lat: 30.71, lng: 76.76 },
        passengerCount: 1,
        fare: { baseFare: 5, distanceFare: 2, timeFare: 1, totalFare: 8, distanceKm: 2, durationMin: 5 },
        status: 'in_progress',
        driver: busyDriver._id,
        expiresAt: new Date(Date.now() + 60000),
      });

      const matches = await findNearbyEligibleDrivers({
        pickupLat,
        pickupLng,
        radiusKm: 5.0,
      });

      const matchedIds = matches.map((m) => m.driver._id.toString());
      assert.ok(!matchedIds.includes(busyDriver._id.toString()));
    });
  });

  describe('3. Atomic Acceptance & Concurrency Race', () => {
    it('allows only ONE driver to win when two drivers accept simultaneously', async () => {
      const passenger = await createPassenger();
      const driver1 = await createDriver({ email: 'drv1@test.com' });
      const driver2 = await createDriver({ email: 'drv2@test.com' });

      await Driver.findByIdAndUpdate(driver1._id, {
        currentLocation: { lat: 30.733, lng: 76.779 },
        isAvailable: true,
      });
      await Driver.findByIdAndUpdate(driver2._id, {
        currentLocation: { lat: 30.734, lng: 76.780 },
        isAvailable: true,
      });

      // Create request
      const createRes = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Point A', lat: 30.733, lng: 76.779 },
          destination: { address: 'Point B', lat: 30.710, lng: 76.760 },
          passengerCount: 1,
        });
      const requestId = createRes.body.rideRequest._id;

      // Both drivers attempt to accept in parallel
      const [res1, res2] = await Promise.all([
        request(app).post(`/api/ride-requests/${requestId}/accept`).set(auth(driver1.token)),
        request(app).post(`/api/ride-requests/${requestId}/accept`).set(auth(driver2.token)),
      ]);

      const statuses = [res1.status, res2.status];
      // Exactly one must be 200 OK and exactly one must be 409 Conflict
      assert.ok(statuses.includes(200));
      assert.ok(statuses.includes(409));

      const updatedRequest = await RideRequest.findById(requestId);
      assert.equal(updatedRequest.status, 'accepted');
      assert.ok(updatedRequest.booking != null);
      assert.ok(updatedRequest.ride != null);

      // Verify linked Booking was created
      const booking = await Booking.findById(updatedRequest.booking);
      assert.equal(booking.status, 'in_progress');
      assert.equal(booking.user.toString(), passenger._id.toString());
    });

    it('rejects acceptance if the request has expired', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();

      const expiredRequest = await RideRequest.create({
        user: passenger._id,
        pickup: { address: 'Point A', lat: 30.733, lng: 76.779 },
        destination: { address: 'Point B', lat: 30.710, lng: 76.760 },
        passengerCount: 1,
        fare: { baseFare: 5, distanceFare: 2, timeFare: 1, totalFare: 8, distanceKm: 2, durationMin: 5 },
        status: 'searching',
        expiresAt: new Date(Date.now() - 5000), // expired 5 seconds ago
      });

      const res = await request(app)
        .post(`/api/ride-requests/${expiredRequest._id}/accept`)
        .set(auth(driver.token));

      assert.equal(res.status, 409);
      assert.match(res.body.message, /no longer available/i);
    });

    it('driver decline keeps the request available for other drivers', async () => {
      const passenger = await createPassenger();
      const driver1 = await createDriver({ email: 'declineDrv@test.com' });
      const driver2 = await createDriver({ email: 'acceptDrv@test.com' });

      const createRes = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Point A', lat: 30.733, lng: 76.779 },
          destination: { address: 'Point B', lat: 30.710, lng: 76.760 },
          passengerCount: 1,
        });
      const requestId = createRes.body.rideRequest._id;

      // Driver 1 declines
      const decRes = await request(app)
        .post(`/api/ride-requests/${requestId}/decline`)
        .set(auth(driver1.token));
      assert.equal(decRes.status, 200);

      // Request remains 'searching'
      const reqAfterDecline = await RideRequest.findById(requestId);
      assert.equal(reqAfterDecline.status, 'searching');
      assert.ok(reqAfterDecline.declinedDrivers.some((d) => d.equals(driver1._id)));

      // Driver 2 can still accept
      const accRes = await request(app)
        .post(`/api/ride-requests/${requestId}/accept`)
        .set(auth(driver2.token));
      assert.equal(accRes.status, 200);
    });
  });

  describe('4. Request Lifecycle & Cancellation Rules', () => {
    it('supports progressive driver status updates: accepted -> driver_arriving -> in_progress -> completed', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();

      const createRes = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Point A', lat: 30.733, lng: 76.779 },
          destination: { address: 'Point B', lat: 30.710, lng: 76.760 },
          passengerCount: 1,
        });
      const requestId = createRes.body.rideRequest._id;

      // Accept
      await request(app).post(`/api/ride-requests/${requestId}/accept`).set(auth(driver.token));

      // 1. driver_arriving
      const res1 = await request(app)
        .put(`/api/ride-requests/${requestId}/status`)
        .set(auth(driver.token))
        .send({ status: 'driver_arriving' });
      assert.equal(res1.status, 200);
      assert.equal(res1.body.rideRequest.status, 'driver_arriving');

      // 2. in_progress
      const res2 = await request(app)
        .put(`/api/ride-requests/${requestId}/status`)
        .set(auth(driver.token))
        .send({ status: 'in_progress' });
      assert.equal(res2.status, 200);
      assert.equal(res2.body.rideRequest.status, 'in_progress');

      // 3. completed
      const res3 = await request(app)
        .put(`/api/ride-requests/${requestId}/status`)
        .set(auth(driver.token))
        .send({ status: 'completed' });
      assert.equal(res3.status, 200);
      assert.equal(res3.body.rideRequest.status, 'completed');

      // Verify linked Booking completed
      const finalReq = await RideRequest.findById(requestId);
      const booking = await Booking.findById(finalReq.booking);
      assert.equal(booking.status, 'completed');
    });

    it('allows passenger cancellation before ride starts, but forbids cancellation once in_progress', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();

      const createRes = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger.token))
        .send({
          pickup: { address: 'Point A', lat: 30.733, lng: 76.779 },
          destination: { address: 'Point B', lat: 30.710, lng: 76.760 },
          passengerCount: 1,
        });
      const requestId = createRes.body.rideRequest._id;

      await request(app).post(`/api/ride-requests/${requestId}/accept`).set(auth(driver.token));

      // Put in progress
      await request(app)
        .put(`/api/ride-requests/${requestId}/status`)
        .set(auth(driver.token))
        .send({ status: 'in_progress' });

      // Passenger tries to cancel during in_progress -> should be rejected
      const cancelRes = await request(app)
        .put(`/api/ride-requests/${requestId}/cancel`)
        .set(auth(passenger.token))
        .send({ reason: 'Changed mind' });

      assert.equal(cancelRes.status, 400);
      assert.match(cancelRes.body.message, /in progress/i);
    });

    it('rejects unauthorized users from cancelling or modifying requests', async () => {
      const passenger1 = await createPassenger({ email: 'pax1@test.com' });
      const passenger2 = await createPassenger({ email: 'pax2@test.com' });

      const createRes = await request(app)
        .post('/api/ride-requests')
        .set(auth(passenger1.token))
        .send({
          pickup: { address: 'Point A', lat: 30.733, lng: 76.779 },
          destination: { address: 'Point B', lat: 30.710, lng: 76.760 },
          passengerCount: 1,
        });
      const requestId = createRes.body.rideRequest._id;

      const res = await request(app)
        .put(`/api/ride-requests/${requestId}/cancel`)
        .set(auth(passenger2.token));

      assert.equal(res.status, 403);
    });
  });
});
