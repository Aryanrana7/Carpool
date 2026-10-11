const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { OAuth2Client } = require('google-auth-library');

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id.apps.googleusercontent.com';

const createApp = require('../app');
const User = require('../models/User');
const Driver = require('../models/Driver');

const app = createApp();
let mongod;

describe('Google Authentication & Passenger Role Separation', () => {
  let originalVerifyIdToken;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    originalVerifyIdToken = OAuth2Client.prototype.verifyIdToken;
  });

  after(async () => {
    OAuth2Client.prototype.verifyIdToken = originalVerifyIdToken;
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Driver.deleteMany({});
  });

  it('rejects request when Google credential is missing', async () => {
    const res = await request(app).post('/api/users/google').send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Google credential token is required');
  });

  it('rejects request when Google client ID is not configured', async () => {
    const origId = process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_ID;
    const res = await request(app).post('/api/users/google').send({ credential: 'any-token' });
    assert.equal(res.status, 500);
    assert.match(res.body.message, /not configured/i);
    process.env.GOOGLE_CLIENT_ID = origId;
  });

  it('registers a new passenger when valid Google credential is provided', async () => {
    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        sub: 'google-sub-12345',
        email: 'newpassenger@google.test',
        email_verified: true,
        name: 'New Google Passenger',
        picture: 'https://avatar.google.test/photo.jpg',
      }),
    });

    const res = await request(app).post('/api/users/google').send({ credential: 'valid-google-id-token' });
    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'New Google Passenger');
    assert.equal(res.body.email, 'newpassenger@google.test');
    assert.equal(res.body.role, 'rider');
    assert.ok(res.body.token);

    const dbUser = await User.findOne({ googleId: 'google-sub-12345' });
    assert.ok(dbUser);
    assert.equal(dbUser.role, 'rider');
    assert.equal(dbUser.picture, 'https://avatar.google.test/photo.jpg');
  });

  it('authenticates returning Google user without creating duplicates', async () => {
    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        sub: 'google-sub-returning-999',
        email: 'returning@google.test',
        email_verified: true,
        name: 'Returning Passenger',
        picture: 'https://avatar.google.test/p1.jpg',
      }),
    });

    // First login -> 201 Created
    const res1 = await request(app).post('/api/users/google').send({ credential: 'token-1' });
    assert.equal(res1.status, 201);

    // Second login -> 200 OK (same account)
    const res2 = await request(app).post('/api/users/google').send({ credential: 'token-2' });
    assert.equal(res2.status, 200);
    assert.equal(res2.body._id, res1.body._id);

    const userCount = await User.countDocuments({ googleId: 'google-sub-returning-999' });
    assert.equal(userCount, 1);
  });

  it('prevents automatic account takeover when email exists with password only', async () => {
    await User.create({
      name: 'Existing Password User',
      email: 'existing@test.com',
      password: 'mypassword123',
      role: 'rider',
    });

    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        sub: 'google-sub-malicious-attempt',
        email: 'existing@test.com',
        email_verified: true,
        name: 'Attacker Name',
      }),
    });

    const res = await request(app).post('/api/users/google').send({ credential: 'token-existing-email' });
    assert.equal(res.status, 409);
    assert.equal(res.body.requiresPasswordAuth, true);

    const userInDb = await User.findOne({ email: 'existing@test.com' });
    assert.equal(userInDb.googleId, null); // Google ID was not silently linked
  });

  it('allows authenticated user to link Google account via /link-google', async () => {
    const user = await User.create({
      name: 'Legit User',
      email: 'legit@test.com',
      password: 'mypassword123',
      role: 'rider',
    });

    const loginRes = await request(app).post('/api/users/login').send({
      email: 'legit@test.com',
      password: 'mypassword123',
    });
    assert.equal(loginRes.status, 200);
    const token = loginRes.body.token;

    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        sub: 'google-sub-linked-777',
        email: 'legit@test.com',
        email_verified: true,
        name: 'Legit User',
        picture: 'https://avatar.google.test/photo2.jpg',
      }),
    });

    const linkRes = await request(app)
      .post('/api/users/link-google')
      .set({ Authorization: `Bearer ${token}` })
      .send({ credential: 'token-to-link' });

    assert.equal(linkRes.status, 200);
    assert.equal(linkRes.body.googleId, 'google-sub-linked-777');

    const updatedUser = await User.findById(user._id);
    assert.equal(updatedUser.googleId, 'google-sub-linked-777');
  });

  it('rejects unverified Google emails', async () => {
    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        sub: 'google-sub-unverified',
        email: 'unverified@google.test',
        email_verified: false,
      }),
    });

    const res = await request(app).post('/api/users/google').send({ credential: 'token-unverified' });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Google email is not verified');
  });

  it('ensures Google passenger token cannot access protected driver routes', async () => {
    OAuth2Client.prototype.verifyIdToken = async () => ({
      getPayload: () => ({
        sub: 'google-sub-pax-only',
        email: 'paxonly@google.test',
        email_verified: true,
        name: 'Passenger Only',
      }),
    });

    const res = await request(app).post('/api/users/google').send({ credential: 'valid-token' });
    assert.equal(res.status, 201);
    const passengerToken = res.body.token;

    // Attempt to access protected driver profile with passenger token
    const driverRes = await request(app)
      .get('/api/drivers/profile')
      .set({ Authorization: `Bearer ${passengerToken}` });

    assert.equal(driverRes.status, 401);
    assert.match(driverRes.body.message, /driver not found|not authorized/i);
  });

  it('rejects with 401 when Google ID token verification throws audience mismatch error', async () => {
    OAuth2Client.prototype.verifyIdToken = async () => {
      throw new Error('Wrong recipient, payload audience != requiredAudience');
    };

    const res = await request(app).post('/api/users/google').send({ credential: 'mismatched-aud-token' });
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Google authentication failed: Invalid or expired token');
  });

  it('normalizes GOOGLE_CLIENT_ID with whitespace or quotes without failing valid tokens', async () => {
    const origId = process.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_ID = '  "test-google-client-id.apps.googleusercontent.com"  ';

    let verifiedAudience;
    OAuth2Client.prototype.verifyIdToken = async ({ audience }) => {
      verifiedAudience = audience;
      return {
        getPayload: () => ({
          sub: 'google-sub-quoted-test',
          email: 'quoted@google.test',
          email_verified: true,
          name: 'Quoted Config Test',
        }),
      };
    };

    const res = await request(app).post('/api/users/google').send({ credential: 'token-quoted' });
    assert.equal(res.status, 201);
    assert.equal(verifiedAudience, 'test-google-client-id.apps.googleusercontent.com');

    process.env.GOOGLE_CLIENT_ID = origId;
  });
});

