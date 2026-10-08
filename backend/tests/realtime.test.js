const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Server } = require('socket.io');
const { io: createClient } = require('socket.io-client');

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const createApp = require('../app');
const { setupRealtime } = require('../realtime');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

let mongod;
let httpServer;
let io;
let socketUrl;

const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connect = (token) => new Promise((resolve, reject) => {
  const socket = createClient(socketUrl, {
    auth: token ? { token } : {},
    transports: ['websocket'],
    forceNew: true,
  });
  socket.once('connect', () => resolve(socket));
  socket.once('connect_error', (error) => {
    socket.disconnect();
    reject(error);
  });
});

describe('realtime authorization', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    httpServer = http.createServer(createApp());
    io = new Server(httpServer, { cors: { origin: '*' } });
    setupRealtime(io, { driverSockets: new Map(), userSockets: new Map() });
    await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    socketUrl = `http://127.0.0.1:${httpServer.address().port}`;
  });

  after(async () => {
    await new Promise((resolve) => io.close(resolve));
    await new Promise((resolve) => httpServer.close(resolve));
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Driver.deleteMany({}),
      Ride.deleteMany({}),
      Booking.deleteMany({}),
    ]);
  });

  it('rejects a client without a JWT', async () => {
    await assert.rejects(connect(), /Authentication required/);
  });

  it('uses the JWT driver identity instead of browser-provided IDs', async () => {
    const passenger = await User.create({ name: 'Passenger', email: 'passenger@test.com', password: 'password123' });
    const driver = await Driver.create({ name: 'Driver', email: 'driver@test.com', password: 'password123', carModel: 'Sedan', carNumber: 'CAR-001' });
    const unrelatedDriver = await Driver.create({ name: 'Other driver', email: 'other@test.com', password: 'password123', carModel: 'SUV', carNumber: 'CAR-002' });
    const ride = await Ride.create({
      driver: driver._id,
      source: 'Downtown',
      destination: 'Airport',
      time: new Date(Date.now() + 60 * 60 * 1000),
      seats: 1,
      price: 10,
    });
    const booking = await Booking.create({ user: passenger._id, ride: ride._id, status: 'confirmed' });

    const passengerSocket = await connect(tokenFor(passenger._id));
    const unrelatedSocket = await connect(tokenFor(unrelatedDriver._id));
    unrelatedSocket.emit('driver:locationUpdate', {
      bookingId: booking._id.toString(),
      driverId: driver._id.toString(),
      lat: 12.9716,
      lng: 77.5946,
    });
    await delay(100);
    assert.equal((await Driver.findById(driver._id)).currentLocation.lat, null);

    const locationUpdate = new Promise((resolve) => passengerSocket.once('driver:locationUpdate', resolve));
    const driverSocket = await connect(tokenFor(driver._id));
    driverSocket.emit('driver:locationUpdate', {
      bookingId: booking._id.toString(),
      driverId: unrelatedDriver._id.toString(),
      lat: 12.9716,
      lng: 77.5946,
    });

    const received = await locationUpdate;
    const persistedDriver = await Driver.findById(driver._id);
    assert.equal(persistedDriver.currentLocation.lat, 12.9716);
    assert.equal(persistedDriver.currentLocation.lng, 77.5946);
    assert.equal(received.driverId, driver._id.toString());

    passengerSocket.disconnect();
    unrelatedSocket.disconnect();
    driverSocket.disconnect();
  });
});
