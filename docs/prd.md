# CarPool Product Requirements Document (PRD)

## 1. Product Overview
CarPool is a full-stack, desktop-optimized web application mimicking Uber's core carpooling functionality. It facilitates real-time ride-sharing by connecting drivers offering seats in their vehicles with passengers looking for a ride along a similar route.

## 2. Portals

### 2.1 User Portal
**Route:** `/`
**Target Audience:** Passengers seeking rides.
**Core Features:**
- **Authentication:** Independent account registration and login for passengers.
- **Ride Search:** 
  - Live address autocomplete (powered by Nominatim).
  - Search filtering by Source and Destination.
- **Booking Flow:**
  - View available rides matching the route criteria.
  - View fare breakdowns (base, distance, time, surge).
  - Instant seat reservation which automatically decrements the driver's available seats.
- **My Trips:**
  - View historical and upcoming bookings.
  - Filter by status (Confirmed, Completed, Cancelled).
- **Payment Integration:** Simulated payment screen supporting Card, UPI, and Wallet checkout flows.
- **Live Tracking:** See the driver's live location on a Leaflet map updating in real-time.

### 2.2 Driver Portal
**Route:** `/driver/dashboard`
**Target Audience:** Drivers offering rides.
**Core Features:**
- **Authentication:** Independent driver registration and login (distinct from passenger accounts).
- **Dashboard Overview:** View driver statistics including total rides, active status, and completed trips.
- **Post a Ride:** Create new ride offers specifying origin, destination, departure time, available seats, pricing, and car type (mini, sedan, suv).
- **Live Broadcasting:** When active, the driver portal captures the driver's device geolocation and continuously broadcasts coordinates to the server and booked passengers.

## 3. Real-Time and Mapping Features
- **Map Interface:** Interactive map using Leaflet that visualizes origins, destinations, and routes.
- **Routing Engine:** Utilizes OSRM for dynamic route line drawing and distance calculation.
- **Real-Time Updates:** Socket.io guarantees instant driver location pushes and ride status updates to the passenger's screen.
- **In-App Messaging:** Real-time chat between the driver and the passenger.

## 4. Design & Aesthetics
- **Responsive Layout:** Sidebar-driven layout on desktop (30% Sidebar / 70% Map), collapsing on smaller screens.
- **Theming:** Full Dark Mode and Light Mode support with a global Theme Toggle.
- **Styling:** Glassmorphism effects, modern typography, and smooth transitions powered by Tailwind CSS and Framer Motion.

## 5. Limitations & Out of Scope (Current State)
- **Production Deployments:** No CI/CD or production server environments are configured; operates locally.
- **Real Financial Transactions:** Payments are strictly UI simulations; no Stripe or external gateway is actually charging cards.
- **Enterprise Maps:** Replaces enterprise services (Google Maps) with free open-source alternatives (Leaflet/Nominatim), which are excellent for demonstration but may lack the granular accuracy and rate-limits of paid enterprise solutions.
- **Strict Role Boundaries:** A passenger account cannot immediately be used as a driver account without registering separately as a Driver.
