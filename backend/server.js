const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createApp = require('./app');
const { setupRealtime } = require('./realtime');

dotenv.config();

// Ensure JWT secret is secure
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'carpoolsecret') {
  console.error('CRITICAL: JWT_SECRET is missing or insecure. Refusing to boot.');
  process.exit(1);
}

connectDB();

const app = createApp();
const server = http.createServer(app);

const { getAllowedOrigins } = require('./config/corsOptions');

const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const driverSockets = new Map();
const userSockets = new Map();

app.set('io', io);
app.set('driverSockets', driverSockets);
app.set('userSockets', userSockets);

setupRealtime(io, { driverSockets, userSockets });

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io ready on port ${PORT}`);
});
