const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const createApp = require('../app');
const seedDatabase = require('../seed/seedData');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const app = createApp();
let mongod;
let memoryUri;

describe('Safe Demo Seeding System & Workflow Verification', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    memoryUri = mongod.getUri();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('runs initial seed and creates required drivers, passengers, rides, bookings, and reviews', async () => {
    const summary = await seedDatabase(memoryUri);

    assert.equal(summary.driversCreated >= 6, true, 'At least 6 drivers created');
    assert.equal(summary.passengersCreated >= 4, true, 'At least 4 passengers created');
    assert.equal(summary.ridesCreated >= 10, true, 'At least 10 rides created');
    assert.equal(summary.bookingsCreated >= 3, true, 'At least 3 bookings created');
    assert.equal(summary.reviewsCreated >= 2, true, 'At least 2 reviews created');

    const totalDrivers = await Driver.countDocuments({});
    assert.equal(totalDrivers, 6);

    const totalPassengers = await User.countDocuments({});
    assert.equal(totalPassengers, 4);

    const totalRides = await Ride.countDocuments({});
    assert.equal(totalRides, 12);
  });

  it('is idempotent: re-running seed on populated DB updates records and creates 0 duplicates', async () => {
    const summary2 = await seedDatabase(memoryUri);

    assert.equal(summary2.driversCreated, 0, '0 new drivers created on re-seed');
    assert.equal(summary2.passengersCreated, 0, '0 new passengers created on re-seed');
    assert.equal(summary2.ridesCreated, 0, '0 new rides created on re-seed');
    assert.equal(summary2.bookingsCreated, 0, '0 new bookings created on re-seed');
    assert.equal(summary2.reviewsCreated, 0, '0 new reviews created on re-seed');

    assert.equal(summary2.driversUpdated, 6, '6 drivers updated on re-seed');
    assert.equal(summary2.passengersUpdated, 4, '4 passengers updated on re-seed');
    assert.equal(summary2.ridesUpdated, 12, '12 rides updated on re-seed');

    // Total counts remain identical
    const totalDrivers = await Driver.countDocuments({});
    assert.equal(totalDrivers, 6);
    const totalPassengers = await User.countDocuments({});
    assert.equal(totalPassengers, 4);
    const totalRides = await Ride.countDocuments({});
    assert.equal(totalRides, 12);
  });

  it('preserves non-demo records without deleting or modifying them', async () => {
    // Create an unrelated customer account and custom ride
    const customUser = await User.create({
      name: 'Independent Customer',
      email: 'customer.real@company.com',
      password: 'RealPassword123!',
      role: 'rider',
    });

    // Re-run seed
    await seedDatabase(memoryUri);

    // Verify non-demo user still exists with unchanged password
    const verifiedUser = await User.findById(customUser._id);
    assert.ok(verifiedUser);
    assert.equal(verifiedUser.email, 'customer.real@company.com');
    const passMatches = await verifiedUser.matchPassword('RealPassword123!');
    assert.equal(passMatches, true, 'Customer password remained intact');
  });

  it('allows passenger demo login using DEMO_PASSWORD', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'aditi.demo@carpool.test',
      password: 'DemoPass123!',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Aditi Mehta');
    assert.equal(res.body.role, 'rider');
    assert.ok(res.body.token);
  });

  it('allows driver demo login using DEMO_PASSWORD', async () => {
    const res = await request(app).post('/api/drivers/login').send({
      email: 'rahul.demo@carpool.test',
      password: 'DemoPass123!',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Rahul Sharma');
    assert.equal(res.body.carModel.includes('Maruti Swift'), true);
    assert.ok(res.body.token);
  });

  it('finds seeded future rides via search API', async () => {
    const res = await request(app).get('/api/rides/search?source=Chandigarh&destination=Delhi');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length >= 1, true, 'At least 1 ride found between Chandigarh and Delhi');
    assert.equal(res.body[0].source, 'Chandigarh');
    assert.equal(res.body[0].destination, 'Delhi');
    assert.equal(res.body[0].seats > 0, true, 'Has available seats');
  });

  it('correctly associates seeded bookings and maintains driver dashboard data', async () => {
    // Rahul's login
    const rahulLogin = await request(app).post('/api/drivers/login').send({
      email: 'rahul.demo@carpool.test',
      password: 'DemoPass123!',
    });
    const rahulToken = rahulLogin.body.token;

    // Fetch driver bookings
    const bookingsRes = await request(app)
      .get('/api/bookings/driver')
      .set({ Authorization: `Bearer ${rahulToken}` });

    assert.equal(bookingsRes.status, 200);
    assert.ok(Array.isArray(bookingsRes.body));
    assert.equal(bookingsRes.body.length >= 1, true, 'Rahul has at least 1 booking request');
    assert.equal(bookingsRes.body[0].user.name, 'Aditi Mehta');
    assert.equal(bookingsRes.body[0].status, 'confirmed');
  });
});
