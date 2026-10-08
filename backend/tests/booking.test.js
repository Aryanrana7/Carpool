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
const Chat = require('../models/Chat');
const Message = require('../models/Message');
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
      name: 'Driver',
      email: `drv-${Date.now()}-${Math.random()}@test.com`,
      password: 'password123',
      carModel: 'Sedan',
      carNumber: 'ABC-123',
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
      source: 'Downtown',
      destination: 'Airport',
      time: futureTime(),
      seats: 2,
      price: 12.5,
      carType: 'Sedan',
      ...overrides,
    });
  assert.equal(res.status, 201);
  return res.body;
}

describe('bookings', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Driver.deleteMany({}),
      Ride.deleteMany({}),
      Booking.deleteMany({}),
      Chat.deleteMany({}),
      Message.deleteMany({}),
      Review.deleteMany({}),
    ]);
  });

  it('allows booking the last seat (seats become 0)', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });

    const book = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    assert.equal(book.status, 201);
    assert.equal(book.body.status, 'pending');

    const updated = await Ride.findById(ride._id);
    assert.equal(updated.seats, 0);
  });

  it('rejects a second active booking of the same ride by the same user', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 3 });

    const first = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });
    assert.equal(first.status, 201);

    const second = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });
    assert.equal(second.status, 400);

    const remaining = await Ride.findById(ride._id);
    assert.equal(remaining.seats, 2);
  });

  it('does not oversell when two passengers book the last seat', async () => {
    const driver = await createDriver();
    const p1 = await createPassenger();
    const p2 = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });

    const [a, b] = await Promise.all([
      request(app).post('/api/bookings').set(auth(p1.token)).send({ rideId: ride._id }),
      request(app).post('/api/bookings').set(auth(p2.token)).send({ rideId: ride._id }),
    ]);

    const statuses = [a.status, b.status].sort();
    assert.deepEqual(statuses, [201, 400]);
    assert.equal(await Booking.countDocuments({ ride: ride._id }), 1);

    const updated = await Ride.findById(ride._id);
    assert.equal(updated.seats, 0);
  });

  it('restores a seat when the passenger cancels a pending booking', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 2 });

    const book = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    const cancel = await request(app)
      .put(`/api/bookings/${book.body._id}/status`)
      .set(auth(passenger.token))
      .send({ status: 'cancelled' });

    assert.equal(cancel.status, 200);

    const updated = await Ride.findById(ride._id);
    assert.equal(updated.seats, 2);
  });

  it('restores a seat only once when cancellation requests race', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });
    const book = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    const [first, second] = await Promise.all([
      request(app).put(`/api/bookings/${book.body._id}/status`).set(auth(passenger.token)).send({ status: 'cancelled' }),
      request(app).put(`/api/bookings/${book.body._id}/status`).set(auth(passenger.token)).send({ status: 'cancelled' }),
    ]);

    const statuses = [first.status, second.status];
    assert.ok(statuses.includes(200));
    assert.ok(statuses.includes(400) || statuses.includes(409));
    assert.equal((await Ride.findById(ride._id)).seats, 1);
  });

  it('rejects passenger completing a booking', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });

    const book = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    const complete = await request(app)
      .put(`/api/bookings/${book.body._id}/status`)
      .set(auth(passenger.token))
      .send({ status: 'completed' });

    assert.equal(complete.status, 400);
  });

  it('rejects illegal driver status skips', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });

    const book = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    const skip = await request(app)
      .put(`/api/bookings/${book.body._id}/driver-status`)
      .set(auth(driver.token))
      .send({ status: 'completed' });

    assert.equal(skip.status, 400);
  });

  it('sets ride in_progress then completed through the driver machine', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });

    const book = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    const confirm = await request(app)
      .put(`/api/bookings/${book.body._id}/driver-status`)
      .set(auth(driver.token))
      .send({ status: 'confirmed' });
    assert.equal(confirm.status, 200);

    const start = await request(app)
      .put(`/api/bookings/${book.body._id}/driver-status`)
      .set(auth(driver.token))
      .send({ status: 'in_progress' });
    assert.equal(start.status, 200);
    assert.equal((await Ride.findById(ride._id)).status, 'in_progress');

    const done = await request(app)
      .put(`/api/bookings/${book.body._id}/driver-status`)
      .set(auth(driver.token))
      .send({ status: 'completed' });
    assert.equal(done.status, 200);
    assert.equal((await Ride.findById(ride._id)).status, 'completed');
    assert.equal((await Ride.findById(ride._id)).seats, 0);
  });

  it('allows re-booking after cancel', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 1 });

    const first = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    await request(app)
      .put(`/api/bookings/${first.body._id}/status`)
      .set(auth(passenger.token))
      .send({ status: 'cancelled' });

    const second = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    assert.equal(second.status, 201);
  });

  it('rejects booking a completed ride even when seats remain', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const ride = await createRide(driver.token, { seats: 2 });
    await Ride.findByIdAndUpdate(ride._id, { status: 'completed' });

    const booking = await request(app)
      .post('/api/bookings')
      .set(auth(passenger.token))
      .send({ rideId: ride._id });

    assert.equal(booking.status, 400);
    assert.equal((await Ride.findById(ride._id)).seats, 2);
  });

  it('does not rehash an unchanged password on save', async () => {
    const passenger = await createPassenger({ password: 'original-password' });
    const user = await User.findById(passenger._id);
    const passwordHash = user.password;
    user.name = 'Updated Passenger';
    await user.save();

    assert.equal(user.password, passwordHash);
    const login = await request(app)
      .post('/api/users/login')
      .send({ email: passenger.email, password: 'original-password' });
    assert.equal(login.status, 200);
  });

  it('prevents unrelated passengers from reading or writing a booking chat', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const unrelatedPassenger = await createPassenger();
    const ride = await createRide(driver.token);
    const booking = await Booking.create({ user: passenger._id, ride: ride._id, status: 'pending' });

    const forbiddenCreate = await request(app)
      .post('/api/chat')
      .set(auth(unrelatedPassenger.token))
      .send({ bookingId: booking._id.toString(), participantId: driver._id });
    assert.equal(forbiddenCreate.status, 403);

    const create = await request(app)
      .post('/api/chat')
      .set(auth(passenger.token))
      .send({ bookingId: booking._id.toString(), participantId: driver._id });
    assert.equal(create.status, 200);

    const forbiddenRead = await request(app)
      .get(`/api/chat/${create.body._id}`)
      .set(auth(unrelatedPassenger.token));
    assert.equal(forbiddenRead.status, 403);

    const forbiddenMessage = await request(app)
      .post('/api/chat/message')
      .set(auth(unrelatedPassenger.token))
      .send({ chatId: create.body._id, text: 'Not my chat' });
    assert.equal(forbiddenMessage.status, 403);
  });

  it('derives review ownership from the completed booking', async () => {
    const driver = await createDriver();
    const passenger = await createPassenger();
    const unrelatedPassenger = await createPassenger();
    const ride = await createRide(driver.token);
    const booking = await Booking.create({ user: passenger._id, ride: ride._id, status: 'completed' });

    const forbiddenReview = await request(app)
      .post('/api/reviews')
      .set(auth(unrelatedPassenger.token))
      .send({ bookingId: booking._id, rating: 5 });
    assert.equal(forbiddenReview.status, 403);

    const review = await request(app)
      .post('/api/reviews')
      .set(auth(passenger.token))
      .send({
        bookingId: booking._id,
        targetId: unrelatedPassenger._id,
        reviewerType: 'driver',
        rating: 5,
      });
    assert.equal(review.status, 201);
    assert.equal(review.body.reviewerType, 'user');
    assert.equal(review.body.driver, driver._id);
  });

  it('does not expose a user directory', async () => {
    const passenger = await createPassenger();
    const response = await request(app).get('/api/users').set(auth(passenger.token));
    assert.equal(response.status, 404);
  });
});
