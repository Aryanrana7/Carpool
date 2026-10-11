# CarPool — Master Demo & Operation Guide

Welcome to the **CarPool** Full-Stack Ride-Sharing Platform demo and operations guide. This document details the system architecture, authentication setup (including Google Sign-In), safe demo data seeding, verification test suites, and operational workflows.

---

## 1. Quick Start

### 1.1 Prerequisites
- **Node.js**: v18 or higher (tested on Node.js v26)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/carpool`) or MongoDB Atlas URI
- **Google Cloud OAuth 2.0 Client ID** (Optional for local Google Sign-In)

---

### 1.2 Environment Configuration

#### Backend Configuration (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/carpool
NODE_ENV=development
JWT_SECRET=a_cryptographically_secure_random_hex_secret_at_least_64_chars
GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
```

#### Frontend Configuration (`frontend/.env`)
Create `frontend/.env` based on `frontend/.env.example`:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com
VITE_ENABLE_DEMO_MODE=true
```

---

### 1.3 Running the Application

1. **Seed Demo Data**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5001 (Health check: http://localhost:5001/health)
   ```

3. **Start Frontend Client**:
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

4. **Run Backend Test Suite**:
   ```bash
   cd backend
   npm test
   # Runs 31 automated tests across all 4 suites
   ```

---

## 2. Seeded Demo Accounts & Credentials

The seed system (`npm run seed`) is completely **non-destructive and idempotent**. It manages only `*.demo@carpool.test` records and preserves all other customer accounts and historical bookings.

All demo accounts share the standard demo password:
```text
Password: DemoPass123!
```

### 2.1 Demo Passenger Accounts (Riders)
| Name | Email | Role | Profile / Tag |
|---|---|---|---|
| **Aditi Mehta** | `aditi.demo@carpool.test` | Passenger | Frequent Rider (Active confirmed booking) |
| **Karan Malhotra** | `karan.demo@carpool.test` | Passenger | Active Trips (Pending booking) |
| **Meera Sharma** | `meera.demo@carpool.test` | Passenger | Weekend Trips (Completed ride + 5★ review) |
| **Dev Patel** | `dev.demo@carpool.test` | Passenger | New Rider (Ready to search & book) |

### 2.2 Demo Driver Accounts
| Driver Name | Email | Vehicle | Plate Number | Main Route | Rating |
|---|---|---|---|---|---|
| **Rahul Sharma** | `rahul.demo@carpool.test` | Maruti Swift (White) | `DL-01-AB-1234` | Chandigarh ⇄ Delhi | 4.9★ (48 reviews) |
| **Priya Verma** | `priya.demo@carpool.test` | Hyundai i20 (Silver) | `CH-01-CD-5678` | Mohali ⇄ Shimla | 4.8★ (35 reviews) |
| **Arjun Singh** | `arjun.demo@carpool.test` | Tata Nexon (Blue) | `PB-65-EF-9012` | Chandigarh ⇄ Amritsar | 5.0★ (62 reviews) |
| **Neha Kapoor** | `neha.demo@carpool.test` | Honda City (Grey) | `CH-01-GH-3456` | Chandigarh ⇄ Ludhiana | 4.7★ (29 reviews) |
| **Aman Thakur** | `aman.demo@carpool.test` | Mahindra XUV300 (Red) | `HP-01-IJ-7890` | Shimla ⇄ Chandigarh | 4.9★ (51 reviews) |
| **Simran Kaur** | `simran.demo@carpool.test` | Maruti Baleno (Silver) | `DL-04-KL-2345` | Delhi ⇄ Chandigarh | 4.8★ (40 reviews) |

---

## 3. Seeded Demo Rides (12 Active Future Routes)

All seeded rides are generated with **dynamically relative future timestamps** (+8h to +72h) so that they remain permanently searchable and never expire.

| # | Route | Driver | Departure Time | Vehicle Type | Seats | Fare |
|---|---|---|---|---|---|---|
| 1 | **Chandigarh → Delhi** | Rahul Sharma | In 8 hours | Sedan (Swift) | 2 available (1 booked by Aditi) | $38 |
| 2 | **Delhi → Chandigarh** | Simran Kaur | In 14 hours | Sedan (Baleno) | 4 available | $36 |
| 3 | **Mohali → Shimla** | Priya Verma | In 18 hours | Mini (i20) | 2 available (1 pending by Karan) | $25 |
| 4 | **Shimla → Chandigarh** | Aman Thakur | In 22 hours | SUV (XUV300) | 4 available | $26 |
| 5 | **Chandigarh → Amritsar** | Arjun Singh | In 28 hours | SUV (Nexon) | 3 available | $32 |
| 6 | **Amritsar → Chandigarh** | Arjun Singh | In 36 hours | SUV (Nexon) | 4 available | $30 |
| 7 | **Chandigarh → Ludhiana** | Neha Kapoor | In 40 hours | Sedan (City) | 3 available | $18 |
| 8 | **Ludhiana → Chandigarh** | Neha Kapoor | In 48 hours | Sedan (City) | 3 available | $18 |
| 9 | **Panchkula → Delhi** | Rahul Sharma | In 54 hours | Sedan (Swift) | 3 available | $40 |
| 10 | **Delhi → Shimla** | Simran Kaur | In 60 hours | Sedan (Baleno) | 3 available | $52 |
| 11 | **Chandigarh → Mohali** | Priya Verma | In 66 hours | Mini (i20) | 2 available | $8 |
| 12 | **Mohali → Chandigarh** | Priya Verma | In 72 hours | Mini (i20) | 3 available | $8 |

---

## 4. Google OAuth 2.0 Integration

### 4.1 Architecture & Security Policy
1. **Official Google Identity Services (GSI)**:
   - Frontend loads `https://accounts.google.com/gsi/client`.
   - Google displays the standard prompt or One Tap popup and returns a signed ID token credential.
2. **Server-Side Token Verification**:
   - The credential is sent to `POST /api/users/google`.
   - Backend verifies token signature, audience, expiration, issuer, and `email_verified: true` using official `google-auth-library`.
3. **Passenger / Driver Isolation**:
   - Google Sign-In always creates/authenticates **passenger accounts** (`role: 'rider'`).
   - Google tokens can never access driver routes or claim driver privileges.
4. **Safe Account Linking Policy**:
   - If a Google email matches an existing email/password account without a linked `googleId`, automatic takeover is refused (HTTP 409 Conflict).
   - The user must log in with their password first, and can securely link their Google account via `POST /api/users/link-google`.

### 4.2 Google Cloud Console Configuration
- **Project**: Carpool App
- **OAuth 2.0 Client**: CarPool Web Client (Web application)
- **Authorized JavaScript Origin**: `http://localhost:5173`
- **Publishing Status**: Testing (Add developer emails under Test Users)
- **Client ID**: Copy into `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`) and `backend/.env` (`GOOGLE_CLIENT_ID`).

---

## 5. Demonstration Workflows

### Flow 1: 1-Click Instant Demo Login
1. Open `http://localhost:5173/login`.
2. In the **Instant Demo Logins** panel, click **Aditi** (Passenger).
3. You are immediately logged in to the passenger portal with Aditi's profile and active trips.

### Flow 2: Search & Book a Ride
1. On the home page (`http://localhost:5173/`), enter:
   - **Pickup**: `Chandigarh`
   - **Destination**: `Delhi`
2. Click **Search Rides**.
3. Select Rahul Sharma's ride ($38, Swift).
4. Click **Book Ride** -> proceed to Payment -> select simulated payment method -> Confirm.
5. Seats are atomically decremented in MongoDB, and the booking appears in **My Trips** (`/my-rides`).

### Flow 3: Driver Portal Management
1. Click **Driver Portal** in the top navigation or visit `http://localhost:5173/driver/login`.
2. Click **Rahul** in the Instant Demo Logins panel.
3. In the Driver Console:
   - View live earnings, completed rides, and pending booking requests.
   - Accept, Start, or Complete ride requests.
   - Live location tracking automatically broadcasts to booked passengers via Socket.io.

---

## 6. Automated Test Matrix

Run all tests anytime using:
```bash
cd backend && npm test
```

| Test Suite | File | Tests | Coverage | Status |
|---|---|---|---|---|
| **Bookings & Atomic State Machine** | `backend/tests/booking.test.js` | 14 tests | Overselling prevention, race conditions, atomic seats, driver skips, chat & review authorization | **PASSED** |
| **Google Authentication & Role Separation** | `backend/tests/googleAuth.test.js` | 10 tests | Missing credential, unverified email, new user registration, returning user, takeover prevention, account linking, driver route isolation, audience mismatch rejection, quoted client ID normalization | **PASSED** |
| **Realtime Authorization** | `backend/tests/realtime.test.js` | 2 tests | Handshake JWT verification, driver identity isolation | **PASSED** |
| **Demo Seeding & Idempotence** | `backend/tests/seed.test.js` | 7 tests | Creation of 6 drivers/4 passengers/12 rides, idempotent re-seeding, non-demo data preservation, demo logins, search queries, driver bookings | **PASSED** |
| **Total** | | **33 tests** | **100% Passing (0 failures)** | **PASSED** |

---

## 7. Inspecting Records in MongoDB Atlas

To verify the seeded collections directly via MongoDB Atlas or mongosh:

```javascript
// Check all demo drivers
db.drivers.find({ email: /@carpool\.test$/ }, { name: 1, email: 1, carModel: 1, averageRating: 1 });

// Check all demo passengers
db.users.find({ email: /@carpool\.test$/ }, { name: 1, email: 1, role: 1, averageRating: 1 });

// Check active future rides
db.rides.find({ status: "active" }, { source: 1, destination: 1, time: 1, seats: 1, price: 1 });

// Check sample bookings and statuses
db.bookings.find({}, { user: 1, ride: 1, status: 1, paymentStatus: 1 });

// Check reviews
db.reviews.find({}, { reviewerType: 1, rating: 1, reviewText: 1 });
```

---

## 8. Implementation Status & Known Limitations

- **Implemented & Verified**:
  - Full email/password and demo passenger/driver authentication.
  - Server-side Google ID-token verification with `google-auth-library` and passenger JWT issuance.
  - Idempotent demo data seeding (`npm run seed`) creating 6 drivers, 4 passengers, 12 dynamic future rides, 3 sample bookings, and 2 reviews.
  - Atomic seat decrement/restoration on booking creation and cancellation.
  - Role isolation between passenger and driver portals.
  - OpenStreetMap & Leaflet interactive map routing.
  - 1-click Demo Logins with real backend authentication.
- **Notes & Limitations**:
  - Google Sign-In requires developer emails to be added under **Test Users** in the Google Cloud Console while the OAuth Consent Screen is in "Testing" mode.
  - Realtime driver tracking simulation broadcasts driver coordinates over WebSockets when active in the driver console.

