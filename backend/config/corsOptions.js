/**
 * Shared CORS Configuration for Express and Socket.IO
 *
 * Ensures all legitimate CarPool environments (local Vite dev and production Vercel)
 * are authorized while blocking unauthorized browser origins.
 */

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://carpool-lac.vercel.app',
];

/**
 * Normalizes and returns the complete allowlist of authorized browser origins.
 * Includes default origins plus any origins provided in FRONTEND_URL
 * (supporting comma-separated lists and stripping accidental trailing slashes).
 *
 * @returns {string[]} Array of authorized origin strings
 */
const getAllowedOrigins = () => {
  const origins = [...DEFAULT_ALLOWED_ORIGINS];
  const envUrl = process.env.FRONTEND_URL;

  if (envUrl && typeof envUrl === 'string') {
    const customOrigins = envUrl
      .split(',')
      .map((url) => url.trim().replace(/\/+$/, ''))
      .filter(Boolean);

    for (const origin of customOrigins) {
      if (!origins.includes(origin)) {
        origins.push(origin);
      }
    }
  }

  return origins;
};

/**
 * Standard CORS options for Express application middleware.
 *
 * @returns {import('cors').CorsOptions}
 */
const getCorsOptions = () => ({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
});

module.exports = {
  DEFAULT_ALLOWED_ORIGINS,
  getAllowedOrigins,
  getCorsOptions,
};
