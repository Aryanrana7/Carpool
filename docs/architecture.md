# CarPool System Architecture

## 1. System Overview
CarPool is a full-stack web application designed to facilitate ride-sharing. It features distinct interfaces for passengers (User Portal) and drivers (Driver Portal). The system handles authentication, real-time geolocation tracking, chat, and complete ride-booking workflows.

## 2. High-Level Architecture
The architecture follows a standard client-server model:

User/Driver Browser (React App)
↓ (HTTP REST API / WebSocket via Socket.io)
Node.js/Express Backend Server
↓ (Mongoose ORM)
MongoDB Database

## 3. Frontend Architecture
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **State Management:** React Context API (`AuthContext`, `DriverAuthContext`, `SocketContext`, `DriverSocketContext`, `ThemeContext`)
- **Folder Structure:** Standard React pattern (`src/components`, `src/pages`, `src/context`, `src/services`)
- **Portals:**
  - **User Portal:** Accessible at `/`, handles passenger ride searches, bookings, and ride history.
  - **Driver Portal:** Accessible at `/driver/dashboard`, handles ride creation and active ride management.
- **Styling:** Tailwind CSS with Framer Motion for animations.
- **API Communication:** Axios instances (likely configured in `services/`).

## 4. Backend Architecture
- **Entry Point:** `server.js` (HTTP + Socket.io server) and `app.js` (Express app instance)
- **Framework:** Express.js 5.2.1
- **Routes:** Modular routing:
  - `/api/auth` — Core authentication routes
  - `/api/users` — Passenger registration, login, Google OAuth, and profile management
  - `/api/drivers` — Driver registration, login, and vehicle profiles
  - `/api/rides` — Scheduled carpool creation, exact route search, and filtering
  - `/api/bookings` — Seat reservations, atomic booking state transitions, and history
  - `/api/ride-requests` — On-demand instant ride dispatch and matching
  - `/api/pricing` — Server-authoritative fare calculation and coordinate validation
  - `/api/proxy` — Nominatim and OSRM proxying with rate limiting
  - `/api/chat` — Authenticated booking participant messaging
  - `/api/reviews` — Verified one-way passenger-to-driver reviews and ratings
  - `/api/support` — Contact inquiries, safety reports, and feedback
- **Controllers:** Business logic separated from routes.
- **Middleware:** Authentication middlewares (`protect` for passengers, `protectDriver` for drivers), CORS, Helmet security headers, rate limiters, JSON body parser.
- **Real-Time:** Socket.io server integrated into HTTP server with JWT verification, managing active socket rooms and targeted trip-level broadcasts.

## 5. Database Architecture
Mongoose is used to model the MongoDB schema. Core models include:
- **User:** Represents passengers (`name`, `email`, `password`, `role`, `googleId`, `picture`).
- **Driver:** Represents drivers (`name`, `email`, `password`, `carModel`, `carNumber`, `isAvailable`, `currentLocation`, `averageRating`, `totalReviews`).
- **Ride:** Represents scheduled carpools (`driver`, `source`, `destination`, `time`, `seats`, `price`, `status`, `distance`, `duration`).
- **RideRequest:** Represents on-demand ride dispatch requests (`user`, `driver`, `pickupLocation`, `dropoffLocation`, `fare`, `status`, `expiresAt`).
- **Booking:** Represents passenger reservations (`user`, `ride`, `status`, `seatsBooked`).
- **Chat / Message:** Booking-scoped participant communication.
- **Review:** One-way passenger ratings after completed trips.
- **SupportTicket:** Customer service inquiries, safety incidents, and feedback.

## 6. Authentication Architecture
- **Method:** JSON Web Tokens (JWT) with bcrypt password hashing (min length: 6).
- **Google OAuth:** Integrated server-side token verification using `google-auth-library`.
- **Storage:** Client-side token storage in `localStorage` with short-lived tokens and backend origin protection.
- **Separation:** Users and Drivers have distinct schemas, separate login endpoints, and separate authentication contexts to prevent privilege escalation.

## 7. Real-Time Architecture
Implemented via Socket.io:
- **Authentication:** Derives driver/passenger identity from JWT in socket handshake.
- **Events:** `driver:locationUpdate`, `ride:statusUpdate`, `request:driverAssigned`, `request:statusUpdate`, `chat:message`.
- **Location Tracking:** Driver location updates broadcast only to passengers with confirmed, active bookings on the trip.

## 8. Mapping Architecture
- **Library:** Leaflet with `react-leaflet` bindings.
- **Tile Provider:** OpenStreetMap.
- **Search (Geocoding):** Nominatim API for address suggestions (proxied through backend with rate limiting).
- **Routing:** OSRM (Open Source Routing Machine) API for route visualization and distance/duration calculations.
- **Live Location:** Displayed by updating Leaflet markers dynamically via React state bound to Socket.io events.

## 9. Deployment Architecture
Configured for local development (`localhost:5173` and `localhost:5001`) with production-ready environment configuration, build pipelines, and CI automation (`.github/workflows/ci.yml`).

## 10. Security Controls
- **Passwords:** Securely hashed with bcrypt (salt rounds: 10).
- **Auth:** JWT route protection on backend APIs with secret strength validation on boot.
- **CORS:** Origin-restricted via `cors` middleware bound to `FRONTEND_URL`.
- **Rate Limiting:** Multi-tier rate limiting active via `express-rate-limit` (`authLimiter` on auth routes, `searchLimiter` on proxy/pricing, and `apiLimiter` on general endpoints).
- **Security Headers:** Enforced via `helmet` middleware.
- **Atomic Concurrency:** Mongo atomic updates (`$inc: { seats: -1 }`) protect seat allocations against race conditions.
