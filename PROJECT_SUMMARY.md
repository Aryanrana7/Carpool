# 🚗 Full-Stack Uber Carpool Clone - Project Summary

This document provides a comprehensive overview of everything implemented in the Carpool application.

## 🌟 Project Overview
A production-level desktop web application built to mimic Uber's core functionality, including user authentication, ride searching with live maps, and a complete booking/payment flow.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Leaflet (OpenStreetMap).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing.
- **Mapping/Routing**: OpenStreetMap (Leaflet) + Nominatim API (Search) + OSRM (Routing).

---

## ⚙️ Backend Implementation (Done)
- **User Authentication**:
  - `POST /api/users`: Registration with hashed passwords.
  - `POST /api/users/login`: Login with JWT generation.
  - `GET /api/users/profile`: Protected route for user info.
- **Ride Management**:
  - `POST /api/rides`: Create new rides (Protected).
  - `GET /api/rides/search`: Advanced search using partial matching and route filtering.
- **Booking System**:
  - `POST /api/bookings`: Create booking with automatic seat decrement.
  - `GET /api/bookings/user`: Retrieve personal booking history.
  - `PUT /api/bookings/:id/status`: Update booking status (cancelling/completing).

---

## 🎨 Frontend Implementation (Done)
- **Advanced UI/UX**:
  - Uber-inspired sidebar layout (30% Sidebar / 70% Map).
  - Glassmorphism effects and modern typography.
  - **Framer Motion**: Smooth animations for page transitions and staggering list items.
- **Mapping System (100% Free)**:
  - **Leaflet Integration**: High-performance interactive map.
  - **Live Search**: Integrated Nominatim API for address suggestions as you type.
  - **Live Routing**: Integrated OSRM to draw routes and calculate distance/duration instantly.
- **Core Pages**:
  - **Home**: Main search and ride selection dashboard.
  - **Auth**: Modern Login and Signup forms with validation.
  - **Booking**: Detailed fare breakdown and route review.
  - **Payment**: Simulated checkout with Card, UPI, and Wallet options.
  - **My Rides**: Booking history with status filters (Confirmed, Cancelled, etc.).

---

## 🚀 How to Run
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The app will be available at http://localhost:5173 (or 5174 if busy).*

---

## ✅ Final Status
- **End-to-End Flow**: Successfully tested (Register -> Search -> Route -> Book -> Payment -> History).
- **No Cost**: Zero API keys or credit cards required due to the Leaflet/OSRM pivot.
- **Ready for Portfolio**: Clean code, scalable structure, and professional UI.

**Last Updated**: 2026-05-03
