# Carpool - Full-Stack Web Application

A full-stack desktop-optimized web app for carpooling: passenger search and booking, driver ride offers, live maps, Socket.io real-time tracking, Google Sign-In, and simulated payments.

---

## Tech Stack

* **Frontend**: React 19 (Vite), Tailwind CSS, Framer Motion, Leaflet, Lucide Icons, Socket.io-client, Google Identity Services
* **Backend**: Node.js, Express 5, MongoDB (Mongoose), Socket.io, google-auth-library
* **Auth**: JWT + bcryptjs + Google OAuth 2.0 Identity Services
* **Documentation**: See [Documentation Index](#documentation) below for architecture, flows, and demo credentials.

---

## Documentation

Comprehensive project documentation is organized in the [`docs/`](docs/) directory:

| Document | Description |
| :--- | :--- |
| [**Architecture**](docs/architecture.md) | System overview, frontend/backend architecture, database schemas, and security controls. |
| [**PRD**](docs/prd.md) | Product requirements, passenger and driver portal specifications, and scope boundaries. |
| [**Workflows**](docs/flow.md) | Mermaid flow diagrams for authentication, booking, and real-time tracking. |
| [**Decisions**](docs/decisions.md) | Architectural decision records (ADRs) explaining monorepo, JWT, free map stack, and re-booking rules. |
| [**Tech Stack**](docs/stack.md) | Detailed dependency and framework inventory. |
| [**Demo Guide**](docs/DEMO_GUIDE.md) | Seeded demo accounts (`DemoPass123!`), route details, and interactive testing walkthroughs. |

---

## Project Structure

```text
Carpool/
├── README.md              # Project overview, setup, and API reference
├── docs/                  # System architecture, PRD, flows, ADRs, and demo guide
│   ├── architecture.md
│   ├── decisions.md
│   ├── flow.md
│   ├── prd.md
│   ├── stack.md
│   └── DEMO_GUIDE.md
├── backend/
│   ├── server.js          # HTTP + Socket.io entry
│   ├── app.js             # Express application factory & middleware
│   ├── config/            # Database connection configuration
│   ├── controllers/       # Business logic controllers
│   ├── middleware/        # JWT auth, driver auth, and rate limiters
│   ├── models/            # Mongoose schemas (User, Driver, Ride, Booking, RideRequest, etc.)
│   ├── routes/            # Express route modules
│   ├── seed/              # Safe, idempotent demo seed script
│   ├── tests/             # Automated test suites (75 passing tests across 18 test suites)
│   └── utils/             # Pricing engine, driver matching, token generation
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI primitives, ride cards, and overlays
    │   ├── context/       # Auth, DriverAuth, Socket, and Theme contexts
    │   ├── pages/         # Passenger and driver route views
    │   ├── services/      # Axios API client and support services
    │   └── utils/         # Currency, time, and date formatters
    └── public/
```

---

## Getting Started

### Prerequisites

* Node.js v18 or higher (tested on Node.js v26)
* MongoDB (local or Atlas)
* npm

### 1. Database & Seeding

```bash
# Seed demo drivers, passengers, rides, and bookings into MongoDB
cd backend
npm run seed
```

### 2. Backend Setup

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
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

```bash
npm run dev
```

API, health check, and Socket.io: [http://localhost:5001](http://localhost:5001) (`GET /health`).

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
VITE_ENABLE_DEMO_MODE=true
```

```bash
npm run dev
```

App: [http://localhost:5173](http://localhost:5173).

### 4. Tests & Production Build

```bash
# Run backend test suite (75 tests across 18 test suites)
cd backend
npm test

# Run frontend production build
cd ../frontend
npm run build
```

---

## Demo Credentials (Password: `DemoPass123!`)

* **Passengers**: `aditi.demo@carpool.test`, `karan.demo@carpool.test`, `meera.demo@carpool.test`, `dev.demo@carpool.test`
* **Drivers**: `rahul.demo@carpool.test`, `priya.demo@carpool.test`, `arjun.demo@carpool.test`, `neha.demo@carpool.test`, `aman.demo@carpool.test`, `simran.demo@carpool.test`

See [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md) for full route details and demo walkthroughs.

---

## API Reference

### Health
* `GET /health` — Server health check endpoint

### User & Auth
* `POST /api/users` — Register passenger
* `POST /api/users/login` — Passenger login, returns JWT
* `POST /api/users/google` — Google Sign-In & registration (verified server-side)
* `POST /api/users/link-google` — Link Google identity to authenticated user
* `GET /api/auth/me` — Current passenger profile (Bearer token)

### Driver
* `POST /api/drivers/register` — Register driver with vehicle details
* `POST /api/drivers/login` — Driver login, returns JWT
* `GET /api/drivers/profile` — Current driver profile
* `PUT /api/drivers/location` — Update driver live GPS coordinates
* `PUT /api/drivers/availability` — Toggle driver online/offline status

### Scheduled Rides
* `POST /api/rides` — Create scheduled ride offer (driver)
* `GET /api/rides/search` — Search available rides with route matching and date filtering
* `GET /api/rides/driver` — Driver's published rides
* `GET /api/rides/:id` — Ride details

### Bookings
* `POST /api/bookings` — Book a seat with atomic seat decrement (passenger)
* `GET /api/bookings/user` — Passenger booking history
* `GET /api/bookings/:id` — Authorized booking details
* `PUT /api/bookings/:id/status` — Passenger cancel booking (`cancelled` only)
* `GET /api/bookings/driver` — Bookings on the driver's rides
* `PUT /api/bookings/:id/driver-status` — Driver status transitions (`confirmed`, `in_progress`, `completed`, `rejected`)
* `GET /api/bookings/driver/stats` — Driver trip statistics

### On-Demand Rides
* `POST /api/ride-requests` — Request instant nearby ride with calculated fare
* `GET /api/ride-requests/active` — Active on-demand ride request for passenger
* `GET /api/ride-requests/driver/nearby` — Nearby matching requests for driver
* `PUT /api/ride-requests/:id/accept` — Driver atomic accept
* `PUT /api/ride-requests/:id/decline` — Driver decline request
* `PUT /api/ride-requests/:id/cancel` — Passenger cancel request
* `PUT /api/ride-requests/:id/status` — Progressive status updates (`driver_arriving`, `in_progress`, `completed`)

### Support & Incident Reporting
* `POST /api/support/contact` — Submit general support contact inquiry
* `POST /api/support/report` — Submit problem or safety incident report
* `GET /api/support/my-reports` — View authenticated user's submitted reports
* `POST /api/support/feedback` — Submit application feedback with star rating

### Pricing & Mapping Proxy
* `GET /api/pricing/estimate` — Server-authoritative distance, duration, and fare calculation
* `GET /api/proxy/geocode` — Rate-limited Nominatim forward geocoding
* `GET /api/proxy/reverse` — Rate-limited Nominatim reverse geocoding
* `GET /api/proxy/route` — Rate-limited OSRM routing proxy

---

## Authors

* Aryan Rana

