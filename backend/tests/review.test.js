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
const Review = require('../models/Review');

const app = createApp();
const futureTime = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

let mongod;

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function createPassenger(overrides = {}) {
  const res = await request(app)
    .post('/api/users')
    .send({
      name: 'Passenger',
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
      carModel: 'Tesla Model 3',
      carNumber: 'TSLA-777',
      ...overrides,
    });
  assert.equal(res.status, 201);
  return res.body;
}

async function createRide(driverToken, overrides = {}) {
  const res = await request(app)
    .post('/api/rides')
    .set(auth(driverToken))
    .send({
      source: 'Chandigarh Sector 17',
      destination: 'Delhi Airport T3',
      time: futureTime(),
      seats: 3,
      price: 45,
      carType: 'Sedan',
      ...overrides,
    });
  assert.equal(res.status, 201);
  return res.body;
}

async function bookAndProgress(passengerToken, driverToken, rideId, targetStatus = 'completed') {
  // 1. Create booking (pending)
  const bookRes = await request(app)
    .post('/api/bookings')
    .set(auth(passengerToken))
    .send({ rideId });
  assert.equal(bookRes.status, 201);
  const bookingId = bookRes.body._id;

  if (targetStatus === 'pending') return bookRes.body;

  // 2. Driver confirms (confirmed)
  const confRes = await request(app)
    .put(`/api/bookings/${bookingId}/driver-status`)
    .set(auth(driverToken))
    .send({ status: 'confirmed' });
  assert.equal(confRes.status, 200);

  if (targetStatus === 'confirmed') return confRes.body;

  // 3. Driver starts ride (in_progress)
  const progRes = await request(app)
    .put(`/api/bookings/${bookingId}/driver-status`)
    .set(auth(driverToken))
    .send({ status: 'in_progress' });
  assert.equal(progRes.status, 200);

  if (targetStatus === 'in_progress') return progRes.body;

  // 4. Driver completes ride (completed)
  const compRes = await request(app)
    .put(`/api/bookings/${bookingId}/driver-status`)
    .set(auth(driverToken))
    .send({ status: 'completed' });
  assert.equal(compRes.status, 200);

  return compRes.body;
}

describe('Active Booking Details and One-Way Review Tests', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await Booking.deleteMany({});
    await Ride.deleteMany({});
    await User.deleteMany({});
    await Driver.deleteMany({});
    await Review.deleteMany({});
  });

  describe('Active Booking Details Authorization (GET /api/bookings/:id)', () => {
    it('allows a passenger to fetch their own booking details', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger.token, driver.token, ride._id, 'in_progress');

      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set(auth(passenger.token));

      assert.equal(res.status, 200);
      assert.equal(res.body._id, booking._id.toString());
      assert.equal(res.body.status, 'in_progress');
      assert.equal(res.body.ride.driver.name, 'Driver Test');
      assert.equal(res.body.ride.driver.carNumber, 'TSLA-777');
    });

    it('allows the driver of the booking to fetch the booking details', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger.token, driver.token, ride._id, 'in_progress');

      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set(auth(driver.token));

      assert.equal(res.status, 200);
      assert.equal(res.body._id, booking._id.toString());
    });

    it('rejects unauthorized passengers from viewing another passenger booking', async () => {
      const passenger1 = await createPassenger({ email: 'pax1@test.com' });
      const passenger2 = await createPassenger({ email: 'pax2@test.com' });
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger1.token, driver.token, ride._id, 'in_progress');

      const res = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set(auth(passenger2.token));

      assert.equal(res.status, 403);
      assert.match(res.body.message, /not authorized/i);
    });
  });

  describe('One-Way Reviews (Passenger to Driver)', () => {
    it('allows a passenger to review the driver after an eligible completed ride', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger.token, driver.token, ride._id, 'completed');

      const reviewRes = await request(app)
        .post('/api/reviews')
        .set(auth(passenger.token))
        .send({
          bookingId: booking._id,
          rating: 5,
          reviewText: 'Excellent driver, very smooth ride!',
        });

      assert.equal(reviewRes.status, 201);
      assert.equal(reviewRes.body.rating, 5);
      assert.equal(reviewRes.body.reviewerType, 'user');
      assert.equal(reviewRes.body.reviewText, 'Excellent driver, very smooth ride!');

      // Verify driver profile average rating recalculated
      const updatedDriver = await Driver.findById(driver._id);
      assert.equal(updatedDriver.averageRating, 5);
      assert.equal(updatedDriver.totalReviews, 1);
    });

    it('rejects reviews for uncompleted rides (e.g. in_progress or confirmed)', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger.token, driver.token, ride._id, 'in_progress');

      const reviewRes = await request(app)
        .post('/api/reviews')
        .set(auth(passenger.token))
        .send({
          bookingId: booking._id,
          rating: 4,
          reviewText: 'Good so far',
        });

      assert.equal(reviewRes.status, 400);
      assert.match(reviewRes.body.message, /completed/i);
    });

    it('rejects reviews if the passenger did not book the ride', async () => {
      const passenger1 = await createPassenger({ email: 'pax11@test.com' });
      const passenger2 = await createPassenger({ email: 'pax22@test.com' });
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger1.token, driver.token, ride._id, 'completed');

      const reviewRes = await request(app)
        .post('/api/reviews')
        .set(auth(passenger2.token))
        .send({
          bookingId: booking._id,
          rating: 5,
          reviewText: 'Fake review attempt',
        });

      assert.equal(reviewRes.status, 403);
      assert.match(reviewRes.body.message, /not authorized/i);
    });

    it('rejects duplicate reviews for the same booking', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger.token, driver.token, ride._id, 'completed');

      const firstRes = await request(app)
        .post('/api/reviews')
        .set(auth(passenger.token))
        .send({
          bookingId: booking._id,
          rating: 4,
          reviewText: 'First review',
        });
      assert.equal(firstRes.status, 201);

      const dupRes = await request(app)
        .post('/api/reviews')
        .set(auth(passenger.token))
        .send({
          bookingId: booking._id,
          rating: 5,
          reviewText: 'Second duplicate review attempt',
        });

      assert.equal(dupRes.status, 400);
      assert.match(dupRes.body.message, /already reviewed/i);
    });

    it('strictly prevents drivers from submitting passenger reviews through API', async () => {
      const passenger = await createPassenger();
      const driver = await createDriver();
      const ride = await createRide(driver.token);
      const booking = await bookAndProgress(passenger.token, driver.token, ride._id, 'completed');

      const driverReviewRes = await request(app)
        .post('/api/reviews')
        .set(auth(driver.token))
        .send({
          bookingId: booking._id,
          rating: 5,
          reviewText: 'Driver rating passenger attempt',
        });

      // Drivers do not have access to passenger review creation
      assert.equal([401, 403].includes(driverReviewRes.status), true);
    });

    it('calculates driver rating from multiple valid passenger reviews accurately', async () => {
      const passengerA = await createPassenger({ email: 'paxA@test.com' });
      const passengerB = await createPassenger({ email: 'paxB@test.com' });
      const driver = await createDriver();
      const rideA = await createRide(driver.token, { source: 'Origin A' });
      const rideB = await createRide(driver.token, { source: 'Origin B' });

      const bookingA = await bookAndProgress(passengerA.token, driver.token, rideA._id, 'completed');
      const bookingB = await bookAndProgress(passengerB.token, driver.token, rideB._id, 'completed');

      // Review 1: 5 stars
      await request(app)
        .post('/api/reviews')
        .set(auth(passengerA.token))
        .send({ bookingId: bookingA._id, rating: 5, reviewText: 'Loved it!' });

      // Review 2: 3 stars
      await request(app)
        .post('/api/reviews')
        .set(auth(passengerB.token))
        .send({ bookingId: bookingB._id, rating: 3, reviewText: 'Average trip' });

      const updatedDriver = await Driver.findById(driver._id);
      assert.equal(updatedDriver.totalReviews, 2);
      assert.equal(updatedDriver.averageRating, 4.0); // (5 + 3) / 2 = 4.0
    });
  });
});
