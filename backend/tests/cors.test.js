const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const createApp = require('../app');
const { getAllowedOrigins, DEFAULT_ALLOWED_ORIGINS } = require('../config/corsOptions');

describe('Express CORS & Preflight Handling', () => {
  const app = createApp();

  it('permits OPTIONS preflight from production Vercel frontend', async () => {
    const res = await request(app)
      .options('/api/users/google')
      .set('Origin', 'https://carpool-lac.vercel.app')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

    assert.equal(res.status, 204);
    assert.equal(res.headers['access-control-allow-origin'], 'https://carpool-lac.vercel.app');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
    assert.match(res.headers['access-control-allow-methods'], /POST/);
    assert.match(res.headers['access-control-allow-headers'], /Content-Type/i);
  });

  it('permits OPTIONS preflight from local development frontend (http://localhost:5173)', async () => {
    const res = await request(app)
      .options('/api/users/google')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    assert.equal(res.status, 204);
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });

  it('rejects OPTIONS preflight from unauthorized origins without granting access headers', async () => {
    const res = await request(app)
      .options('/api/users/google')
      .set('Origin', 'https://malicious-site.com')
      .set('Access-Control-Request-Method', 'POST');

    assert.equal(res.status, 204);
    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });

  it('grants CORS header on actual POST /api/users/google from production origin', async () => {
    const res = await request(app)
      .post('/api/users/google')
      .set('Origin', 'https://carpool-lac.vercel.app')
      .send({});

    // Status is 400 because credential is missing, but CORS headers must be present
    assert.equal(res.status, 400);
    assert.equal(res.headers['access-control-allow-origin'], 'https://carpool-lac.vercel.app');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });

  it('withholds CORS header on actual requests from unauthorized origins', async () => {
    const res = await request(app)
      .post('/api/users/google')
      .set('Origin', 'https://unauthorized-domain.org')
      .send({});

    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });

  it('allows health check endpoint without Origin header (curl/monitoring)', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.status, 'healthy');
  });

  it('correctly parses and normalizes FRONTEND_URL including trailing slashes and comma-separated lists', () => {
    const originalEnv = process.env.FRONTEND_URL;
    try {
      process.env.FRONTEND_URL = 'https://custom-preview.vercel.app/, https://staging.carpool.com ';
      const origins = getAllowedOrigins();

      assert.ok(origins.includes('http://localhost:5173'));
      assert.ok(origins.includes('https://carpool-lac.vercel.app'));
      assert.ok(origins.includes('https://custom-preview.vercel.app'));
      assert.ok(origins.includes('https://staging.carpool.com'));
      // Ensure no trailing slashes
      origins.forEach((origin) => {
        assert.ok(!origin.endsWith('/'), `Origin ${origin} should not have a trailing slash`);
      });
    } finally {
      process.env.FRONTEND_URL = originalEnv;
    }
  });
});
