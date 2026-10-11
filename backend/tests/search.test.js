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

const app = createApp();
let mongod;
let testDriver;

describe('Ride Search, Route Matching & Filtering Precision', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Driver.deleteMany({});
    await Ride.deleteMany({});

    testDriver = await Driver.create({
      name: 'Test Driver',
      email: 'driver.search@carpool.test',
      password: 'DemoPass123!',
      carModel: 'Honda City (White)',
      carNumber: 'CH-01-TEST',
      averageRating: 4.9,
      totalReviews: 25,
    });
  });

  it('1. Delhi -> Jammu with no matching ride returns an empty result ([])', async () => {
    // Create an unrelated ride: Chandigarh -> Delhi
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 24 * 3600 * 1000),
      seats: 3,
      price: 35,
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=Delhi&destination=Jammu');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 0, 'Must return 0 rides for Delhi -> Jammu');
  });

  it('2. Delhi -> Jammu does not return unrelated Chandigarh -> Delhi or Chandigarh -> Ludhiana rides', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 12 * 3600 * 1000),
      seats: 2,
      price: 40,
      status: 'active',
    });
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Ludhiana',
      time: new Date(Date.now() + 14 * 3600 * 1000),
      seats: 3,
      price: 20,
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=Delhi&destination=Jammu');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });

  it('3. Delhi -> Jammu does not return a reverse Jammu -> Delhi ride', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Jammu',
      destination: 'Delhi',
      time: new Date(Date.now() + 18 * 3600 * 1000),
      seats: 3,
      price: 50,
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=Delhi&destination=Jammu');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0, 'Reverse route must not match');
  });

  it('4. An exact matching ride is returned with driver details', async () => {
    const createdRide = await Ride.create({
      driver: testDriver._id,
      source: 'Delhi',
      destination: 'Jammu',
      time: new Date(Date.now() + 20 * 3600 * 1000),
      seats: 3,
      price: 55,
      carType: 'Honda City',
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=Delhi&destination=Jammu');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0]._id.toString(), createdRide._id.toString());
    assert.equal(res.body[0].source, 'Delhi');
    assert.equal(res.body[0].destination, 'Jammu');
    assert.equal(res.body[0].driver.name, 'Test Driver');
    assert.equal(res.body[0].driver.averageRating, 4.9);
  });

  it('5. Case insensitivity and leading/trailing extra spaces match correctly', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 10 * 3600 * 1000),
      seats: 4,
      price: 38,
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=%20%20chandigarh%20%20&destination=DELHI%20');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].source, 'Chandigarh');
    assert.equal(res.body[0].destination, 'Delhi');
  });

  it('6. A ride with no available seats (seats = 0) is excluded from search results', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 15 * 3600 * 1000),
      seats: 0,
      price: 38,
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=Chandigarh&destination=Delhi');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0, 'Full ride with 0 seats must not be returned');
  });

  it('7. Cancelled or completed rides are excluded from search results', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 15 * 3600 * 1000),
      seats: 3,
      price: 38,
      status: 'cancelled',
    });
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 16 * 3600 * 1000),
      seats: 3,
      price: 38,
      status: 'completed',
    });

    const res = await request(app).get('/api/rides/search?source=Chandigarh&destination=Delhi');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0, 'Cancelled and completed rides must not appear');
  });

  it('8. Past departure rides are excluded from search results', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() - 3600 * 1000), // 1 hour in the past
      seats: 3,
      price: 38,
      status: 'active',
    });

    const res = await request(app).get('/api/rides/search?source=Chandigarh&destination=Delhi');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0, 'Past rides must not be returned');
  });

  it('9. Address with region suffix (e.g. "Chandigarh, India") matches primary city', async () => {
    await Ride.create({
      driver: testDriver._id,
      source: 'Chandigarh',
      destination: 'Delhi',
      time: new Date(Date.now() + 20 * 3600 * 1000),
      seats: 3,
      price: 38,
      status: 'active',
    });

    const res = await request(app).get(
      '/api/rides/search?source=' + encodeURIComponent('Chandigarh, India') + '&destination=' + encodeURIComponent('Delhi, India')
    );
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
  });
});
