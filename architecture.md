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
- **Entry Point:** `server.js`
- **Framework:** Express.js 5.2.1
- **Routes:** Modular routing (`userRoutes`, `authRoutes`, `rideRoutes`, `bookingRoutes`, `driverRoutes`, `pricingRoutes`, `chatRoutes`, `reviewRoutes`)
- **Controllers:** Business logic separated from routes.
- **Middleware:** Authentication middlewares (`protect` for users, driver equivalents), CORS, JSON body parser.
- **Real-Time:** Socket.io server integrated into the Express HTTP server, managing `driverSockets` and `userSockets` maps for targeted emissions.

## 5. Database Architecture
Mongoose is used to model the MongoDB schema. Important models include:
- **User:** Represents passengers. Fields: `name`, `email`, `password`, `role` (rider/driver), `averageRating`.
- **Driver:** Represents drivers. Fields: `name`, `email`, `password`, `carModel`, `carNumber`, `isAvailable`, `currentLocation` (lat/lng), `averageRating`.
- **Ride:** Represents a scheduled or active ride offer. Fields: `driver` (Ref: Driver), `source`, `destination`, `time`, `seats`, `price`, `status` (active, in_progress, completed, cancelled).
- **Booking:** Represents a passenger's seat reservation on a ride. Fields: `user` (Ref: User), `ride` (Ref: Ride), `status` (pending, confirmed, in_progress, cancelled, completed).
- **Chat / Message:** Handles real-time messaging between users and drivers.
- **Review:** Rating system schema.

## 6. Authentication Architecture
- **Method:** JSON Web Tokens (JWT).
- **Storage:** Client-side token storage (managed via AuthContext/localStorage).
- **Passwords:** Hashed via `bcryptjs` using a Mongoose `pre('save')` hook.
- **Separation:** Users and Drivers have distinct schemas, distinct login endpoints (`/api/users/login` vs driver auth), and distinct frontend contexts/protected routes to prevent privilege escalation.

## 7. Real-Time Architecture
Implemented via Socket.io:
- **Events:** `driver:register`, `user:register`, `driver:locationUpdate`, `driver:rideStatus`, `joinChat`, `sendMessage`, `typing`.
- **Location Tracking:** Driver client emits `driver:locationUpdate` containing coordinates. The server updates the Driver document in MongoDB and forwards the coordinates directly to the passenger's registered socket room.

## 8. Mapping Architecture
- **Library:** Leaflet with `react-leaflet` bindings.
- **Tile Provider:** OpenStreetMap.
- **Search (Geocoding):** Nominatim API for address suggestions.
- **Routing:** OSRM (Open Source Routing Machine) API is used for route visualization, drawing polylines, and calculating distance/duration instantly.
- **Live Location:** Displayed by updating Leaflet markers dynamically via React state bound to Socket.io events.

## 9. Deployment Architecture
Deployment architecture is not defined in the repository. The project is currently configured for local development (`localhost:5173` and `localhost:5000/5001`).

## 10. Security Considerations
- **Passwords:** Securely hashed with bcrypt (salt rounds: 10).
- **Auth:** JWT-based route protection on backend APIs.
- **CORS:** Enabled for all origins (`*`) in Socket.io and Express, which is suitable for development but represents a security limitation that should be tightened before production.
- **Limitations:** No explicit rate limiting, no refresh token mechanism, no strict input sanitization library (relies on Mongoose schema casting).
