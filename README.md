# Carpool - Full-Stack Web Application

A full-stack desktop-optimized web app for carpooling: passenger search and booking, driver ride offers, live maps, and simulated payments.

---

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Leaflet, Lucide Icons, Socket.io-client
* **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io
* **Auth**: JWT + bcryptjs

---

## Project Structure

```text
Carpool/
├── README.md
├── plan.md
├── backend/
│   ├── server.js          # HTTP + Socket.io entry
│   ├── app.js             # Express app (used by server and tests)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── utils/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    └── public/
```

---

## Getting Started

### Prerequisites

* Node.js v18 or higher
* MongoDB (local or Atlas)
* npm

### 1. Database

```bash
brew services start mongodb-community
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/carpool
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

```bash
npm run dev
```

API, health check, and Socket.io: [http://localhost:5001](http://localhost:5001) (`GET /health`).

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

```bash
npm run dev
```

App: [http://localhost:5173](http://localhost:5173).

### Tests

```bash
cd backend
npm test
```

---

## API Reference

### User & Auth

* `POST /api/users` — Register passenger
* `POST /api/users/login` — Passenger login, returns JWT
* `GET /api/auth/me` — Current passenger profile (Bearer token)

### Driver

* `POST /api/drivers/register` — Register driver
* `POST /api/drivers/login` — Driver login
* `GET /api/drivers/profile` — Current driver profile

### Rides

* `POST /api/rides` — Create ride (driver)
* `GET /api/rides/search` — Search available rides
* `GET /api/rides/driver` — Driver's rides
* `GET /api/rides/:id` — Ride details

### Bookings

* `POST /api/bookings` — Book a seat (passenger)
* `GET /api/bookings/user` — Passenger booking history
* `PUT /api/bookings/:id/status` — Passenger cancel (`cancelled` only)
* `GET /api/bookings/driver` — Bookings for the driver's rides
* `PUT /api/bookings/:id/driver-status` — Driver status updates
* `GET /api/bookings/driver/stats` — Driver stats

---

## Authors

* Aryan Rana
