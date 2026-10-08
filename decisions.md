# CarPool Technical Decisions

# Decision: Monorepo Architecture with Separated Frontend/Backend

## Status
Implemented

## Context
The project required a standard client-server model to separate presentation logic from data persistence and business rules.

## Decision
Organize the project with distinct `frontend` (React/Vite) and `backend` (Node/Express) directories within the same repository.

## Reason
The repository does not document the original rationale, but this is a standard pattern for full-stack JavaScript applications that eases local development and repository management.

## Consequences
- Requires running two separate development servers (`npm run dev` in both folders).
- Simplifies dependency management by separating client and server dependencies.

---

# Decision: Distinct User and Driver Portals

## Status
Implemented

## Context
Passengers and Drivers have fundamentally different workflows, data access requirements, and UI needs.

## Decision
Create distinct portals within the same React application, accessed via different routes (`/` for Users, `/driver/*` for Drivers), rather than combining them into a single interface or creating two separate frontend codebases.

## Reason
Allows code reuse (components, themes, map utilities) while maintaining strict separation of concerns and preventing a cluttered UI. 

## Consequences
- Requires distinct authentication contexts (`AuthContext` and `DriverAuthContext`).
- Demands careful route protection logic to prevent users from accessing driver routes and vice versa.

---

# Decision: 100% Free Mapping Stack (Leaflet + Nominatim + OSRM)

## Status
Implemented

## Context
Providing core Uber-like functionality requires interactive maps, address autocomplete, and route drawing. Commercial APIs like Google Maps can be cost-prohibitive for personal or portfolio projects.

## Decision
Utilize Leaflet (`react-leaflet`) for rendering, Nominatim API for geocoding/search, and OSRM for routing.

## Reason
To achieve "Zero API keys or credit cards required" as explicitly stated in the project summary, allowing the project to be freely deployable and usable as a portfolio piece.

## Consequences
- Completely free and open-source mapping stack.
- Nominatim API has strict rate limits and usage policies that must be respected.
- OSRM public instances may occasionally suffer from downtime or latency compared to enterprise solutions.

---

# Decision: Real-Time Communication via Socket.io

## Status
Implemented

## Context
The application needs to push live driver location updates and ride status changes to the passenger instantly.

## Decision
Use `socket.io` and `socket.io-client` for real-time WebSocket communication.

## Reason
The repository does not document the original rationale, but Socket.io provides robust abstractions over raw WebSockets, including automatic reconnections and simple room/event broadcasting.

## Consequences
- Requires the backend server to maintain stateful socket maps (`userSockets`, `driverSockets`).
- Enables instant location tracking and chat functionalities without heavy HTTP polling.

---

# Decision: Re-book After Cancel

## Status
Implemented

## Context
A passenger who cancels (or is rejected) may want the same ride again if seats remain.

## Decision
Allow a new booking on the same ride after the previous one is `cancelled` or `rejected`. Enforce uniqueness only for active statuses (`pending`, `confirmed`, `in_progress`) via a partial MongoDB index.

## Consequences
- Seat inventory is restored on cancel/reject, then held again on re-book.
- History keeps the old cancelled/rejected row plus the new booking.

---

# Decision: Custom JWT Authentication

## Status
Implemented

## Context
Both portals require secure authentication to protect routes and identify actors making API requests.

## Decision
Implement a custom authentication flow using `jsonwebtoken` and `bcryptjs` over MongoDB, avoiding third-party identity providers like Auth0 or Firebase.

## Reason
The repository does not document the original rationale.

## Consequences
- Keeps the system self-contained without external dependencies.
- Passwords must be securely hashed and stored in the application's database.
