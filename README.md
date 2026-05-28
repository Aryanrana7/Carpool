# 🚗 Uber Carpool Clone - Full-Stack Web Application

A full-stack desktop-optimized web application mimicking Uber's core carpooling functionality. This project features user and driver authentication, live interactive maps, routing, automatic seat management, booking workflows, and simulated payments.

---

## 🌟 Key Features

### 👤 Passenger Portal
* **Live Search**: Auto-suggestions for addresses powered by Nominatim API.
* **Interactive Maps**: Route planning and distance calculation powered by OpenStreetMap & OSRM routing.
* **Booking Workflow**: Instant seat allocation and seat decrementing.
* **Simulated Payments**: Integration screen with Card, UPI, and Wallet payment options.
* **My Rides**: Booking history with filtering by status (Confirmed, Completed, Cancelled).

### 👨‍✈️ Driver Portal
* **Dashboard Overview**: Access driver statistics (total rides, active status, completed trips).
* **Create a Ride**: Instantly offer ride shares specifying origin, destination, seats, and pricing.
* **Real-time Tracking**: Emits current driver location coordinates to booked passengers via Socket.io.

### ⚡ Technical Features
* **Distinct Roles**: Independent authentication contexts for Passengers and Drivers.
* **Real-time Communication**: Chat messaging and live location updates powered by Socket.io.
* **Rich Styling**: Sleek Glassmorphism styling, clean animations via Framer Motion, and native Dark Mode support.

---

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Leaflet (Mapping), Lucide Icons, Socket.io-client.
* **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
* **Security & Auth**: JWT (JSON Web Tokens), Bcryptjs password hashing, Custom Auth Middleware.

---

## 📂 Project Structure

```text
Carpool/
├── README.md
├── .gitignore
└── carpool-app/
    ├── backend/
    │   ├── server.js
    │   ├── config/          # Database configuration
    │   ├── controllers/     # Route business logic
    │   ├── middleware/      # Authentication & route protection
    │   ├── models/          # Mongoose DB schemas
    │   ├── routes/          # Express route definitions
    │   └── utils/           # Utility helpers
    └── frontend/
        ├── index.html
        ├── src/
        │   ├── components/  # Reusable UI & portal widgets
        │   ├── context/     # State management (Auth, Sockets, Theme)
        │   ├── pages/       # Core app pages
        │   └── services/    # Axios HTTP configuration
        └── public/
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local Community Edition or MongoDB Atlas connection string)
* **npm** (comes bundled with Node.js)

### 1. Database Setup
Ensure that your local MongoDB server is running. On macOS (with Homebrew), you can run:
```bash
brew services start mongodb-community
```

---

### 2. Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd carpool-app/backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder and configure the following variables:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/carpool
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run on [http://localhost:5001](http://localhost:5001).*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd carpool-app/frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on [http://localhost:5173](http://localhost:5173).*

---

## 📡 API Reference

### 👤 User & Auth Endpoints
* `POST /api/users` - Register a passenger profile.
* `POST /api/auth/login` - Authenticate passenger & receive JWT token.
* `GET /api/auth/user` - Retrieve active passenger profile.

### 🚗 Ride Endpoints
* `POST /api/rides` - Create a new ride offer (Driver only).
* `GET /api/rides/search` - Search and filter available ride matches.

### 📅 Booking Endpoints
* `POST /api/bookings` - Book seats on a ride.
* `GET /api/bookings/user` - Get passenger's booking history.
* `PUT /api/bookings/:id/status` - Update booking state (Cancel/Complete).

---

## 👥 Authors
* **Aryan Rana**
# Carpool
