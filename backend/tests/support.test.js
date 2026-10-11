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
const SupportTicket = require('../models/SupportTicket');
const Feedback = require('../models/Feedback');

const app = createApp();
let mongod;

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function createPassenger(overrides = {}) {
  const res = await request(app)
    .post('/api/users')
    .send({
      name: 'Test Passenger',
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
      name: 'Test Driver',
      email: `drv-${Date.now()}-${Math.random()}@test.com`,
      password: 'password123',
      carModel: 'Hyundai Creta',
      carNumber: 'CH-01-AB-1234',
      licenseNumber: `LIC-${Date.now()}`,
      phone: '9876543210',
      ...overrides,
    });
  assert.equal(res.status, 201);
  return res.body;
}

describe('Contact & Support API Suite', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await SupportTicket.deleteMany({});
    await Feedback.deleteMany({});
    await Booking.deleteMany({});
    await Ride.deleteMany({});
    await User.deleteMany({});
    await Driver.deleteMany({});
  });

  describe('1. Contact Inquiries (POST /api/support/contact)', () => {
    it('accepts valid guest contact inquiries and returns a ticket ID', async () => {
      const res = await request(app)
        .post('/api/support/contact')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+91 9103882218',
          subject: 'Question regarding route scheduling',
          message: 'Can I request a recurring daily pickup at 8:30 AM?',
          category: 'general_inquiry',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.match(res.body.ticketId, /^CP-CNT-/);

      const saved = await SupportTicket.findOne({ ticketId: res.body.ticketId });
      assert.ok(saved);
      assert.equal(saved.name, 'Jane Doe');
      assert.equal(saved.email, 'jane@example.com');
      assert.equal(saved.userType, 'guest');
      assert.equal(saved.type, 'contact');
      assert.equal(saved.status, 'open');
    });

    it('rejects contact inquiry with missing required fields', async () => {
      const res = await request(app)
        .post('/api/support/contact')
        .send({
          name: '',
          email: 'not-an-email',
          subject: '',
          message: '',
        });

      assert.equal(res.status, 400);
    });

    it('associates authenticated passenger account with contact submission', async () => {
      const pax = await createPassenger({ name: 'Rohit Sharma', email: 'rohit@test.com' });

      const res = await request(app)
        .post('/api/support/contact')
        .set(auth(pax.token))
        .send({
          name: 'Rohit Sharma',
          email: 'rohit@test.com',
          subject: 'Booking clarification',
          message: 'Need help understanding payment confirmation receipt.',
          category: 'general_inquiry',
        });

      assert.equal(res.status, 201);
      const saved = await SupportTicket.findOne({ ticketId: res.body.ticketId });
      assert.ok(saved);
      assert.equal(String(saved.user), String(pax._id));
      assert.equal(saved.userType, 'passenger');
    });
  });

  describe('2. Problem & Safety Reporting (POST /api/support/report)', () => {
    it('submits a problem report and assigns ticket ID', async () => {
      const res = await request(app)
        .post('/api/support/report')
        .send({
          name: 'Aarav Patel',
          email: 'aarav@test.com',
          category: 'technical',
          subject: 'Map telemetry glitch during evening trip',
          description: 'The live vehicle marker stopped updating for 2 minutes.',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.match(res.body.ticketId, /^CP-RPT-/);

      const saved = await SupportTicket.findOne({ ticketId: res.body.ticketId });
      assert.equal(saved.type, 'problem_report');
      assert.equal(saved.category, 'technical');
    });

    it('labels safety concerns as safety_incident with CP-SFT prefix', async () => {
      const res = await request(app)
        .post('/api/support/report')
        .send({
          name: 'Kavita Singh',
          email: 'kavita@test.com',
          category: 'safety_concern',
          subject: 'Reckless driving report',
          description: 'Driver exceeded speed limit and engaged in harsh braking.',
        });

      assert.equal(res.status, 201);
      assert.match(res.body.ticketId, /^CP-SFT-/);

      const saved = await SupportTicket.findOne({ ticketId: res.body.ticketId });
      assert.equal(saved.type, 'safety_incident');
      assert.equal(saved.category, 'safety_concern');
    });

    it('validates booking ownership: forbids reporting on another user booking', async () => {
      const pax1 = await createPassenger();
      const pax2 = await createPassenger();
      const drv = await createDriver();

      const ride = await Ride.create({
        driver: drv._id,
        source: 'Chandigarh',
        destination: 'Delhi',
        time: new Date(Date.now() + 3600000),
        seats: 3,
        price: 450,
      });

      const booking = await Booking.create({
        ride: ride._id,
        user: pax1._id,
        seatsBooked: 1,
        totalPrice: 450,
        status: 'confirmed',
      });

      // Pax 2 tries to reference Pax 1's booking
      const res = await request(app)
        .post('/api/support/report')
        .set(auth(pax2.token))
        .send({
          name: pax2.name,
          email: pax2.email,
          category: 'ride_issue',
          subject: 'Dispute over booking',
          description: 'Unauthorized reference test',
          relatedBookingId: booking._id.toString(),
        });

      assert.equal(res.status, 403);
      assert.match(res.body.message, /not authorized/i);
    });

    it('allows passenger to reference their own valid booking', async () => {
      const pax = await createPassenger();
      const drv = await createDriver();

      const ride = await Ride.create({
        driver: drv._id,
        source: 'Sector 17',
        destination: 'Mohali Phase 8',
        time: new Date(Date.now() + 3600000),
        seats: 2,
        price: 100,
      });

      const booking = await Booking.create({
        ride: ride._id,
        user: pax._id,
        seatsBooked: 1,
        totalPrice: 100,
        status: 'confirmed',
      });

      const res = await request(app)
        .post('/api/support/report')
        .set(auth(pax.token))
        .send({
          name: pax.name,
          email: pax.email,
          category: 'ride_issue',
          subject: 'Driver arrived at alternate gate',
          description: 'Pickup location was slightly shifted from Sector 17 fountain.',
          relatedBookingId: booking._id.toString(),
        });

      assert.equal(res.status, 201);
      const saved = await SupportTicket.findOne({ ticketId: res.body.ticketId });
      assert.equal(String(saved.relatedBooking), String(booking._id));
    });
  });

  describe('3. User Report History (GET /api/support/my-reports)', () => {
    it('requires authentication to view reports', async () => {
      const res = await request(app).get('/api/support/my-reports');
      assert.equal(res.status, 401);
    });

    it('returns only the authenticated user reports and preserves privacy', async () => {
      const pax1 = await createPassenger();
      const pax2 = await createPassenger();

      await SupportTicket.create({
        ticketId: 'CP-TKT-1001',
        user: pax1._id,
        name: pax1.name,
        email: pax1.email,
        category: 'technical',
        subject: 'Pax 1 issue',
        message: 'Details for pax 1',
        type: 'problem_report',
      });

      await SupportTicket.create({
        ticketId: 'CP-TKT-2002',
        user: pax2._id,
        name: pax2.name,
        email: pax2.email,
        category: 'technical',
        subject: 'Pax 2 secret issue',
        message: 'Private message for pax 2',
        type: 'problem_report',
      });

      const res = await request(app)
        .get('/api/support/my-reports')
        .set(auth(pax1.token));

      assert.equal(res.status, 200);
      assert.equal(res.body.tickets.length, 1);
      assert.equal(res.body.tickets[0].ticketId, 'CP-TKT-1001');
      assert.equal(res.body.tickets[0].subject, 'Pax 1 issue');
    });
  });

  describe('4. Feedback Submission (POST /api/support/feedback)', () => {
    it('submits valid feedback with category, rating, and message', async () => {
      const res = await request(app)
        .post('/api/support/feedback')
        .send({
          category: 'app_experience',
          rating: 5,
          message: 'The new booking flow is intuitive and quick!',
          contactPreference: 'email',
          email: 'happy@test.com',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);

      const saved = await Feedback.findById(res.body.id);
      assert.ok(saved);
      assert.equal(saved.category, 'app_experience');
      assert.equal(saved.rating, 5);
      assert.equal(saved.contactPreference, 'email');
    });

    it('rejects feedback with missing required fields or invalid category', async () => {
      const res = await request(app)
        .post('/api/support/feedback')
        .send({
          category: 'invalid_category',
          message: '',
        });

      assert.equal(res.status, 400);
    });
  });
});
