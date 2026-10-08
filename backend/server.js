const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createApp = require('./app');
const { setupRealtime } = require('./realtime');

dotenv.config();
connectDB();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
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
