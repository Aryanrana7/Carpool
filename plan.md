# CarPool — Further Progress Plan

Working roadmap from the current local demo toward a reliable, demo-ready (then production-shaped) ride-sharing app. Scope is grounded in the existing passenger + driver portals, Express/Mongo backend, and Socket.io maps/chat.

## Next milestone — Secure, reliable demo

Complete these items before adding matching, payments, or UI polish. They address the current trust boundaries and regressions found during the V2 review.

| Priority | Work | Acceptance criteria |
|---|---|---|
| P0 | Authorize chat access | Only the passenger and driver associated with a booking can create, read, or post to its chat. Add negative authorization tests. |
| P0 | Authenticate Socket.io | Verify the JWT during the Socket.io handshake; derive identity from it rather than `driverId` / `userId` supplied by the browser. |
| P0 | Authorize reviews | Allow a rider to review only their completed booking's driver, and its driver to review only that rider. Ignore client-supplied target identity. |
| P0 | Remove user-data exposure | Remove `GET /api/users` unless it is required, or limit it to an authorized admin and explicitly select safe fields. |
| P1 | Close booking edge cases | Reject bookings for cancelled, completed, or in-progress rides; make cancellation/status updates atomic so a concurrent request cannot release a seat twice. |
| P1 | Fix credential preservation | Change both password hooks to `return next()` when the password is unchanged, then test that profile updates do not invalidate login. |
| P1 | Restore frontend quality gate | Fix the `RideHistory` rating callback and resolve all ESLint errors; `npm run lint --prefix frontend` must pass. |

**Milestone exit check:** a passenger and driver can complete the booking → confirm → start → finish → review flow, while unauthorized HTTP and socket clients are rejected. Backend tests, frontend lint, and the production build all pass.

**Out of scope unless explicitly pulled in later:** real card charging, Google Maps, mobile native apps, multi-region deploy.

---

## Current baseline

Done and usable locally:

- Separate passenger (`User`) and driver (`Driver`) JWT auth
- Ride create / text search / book / cancel / complete
- Simulated payment UI
- Leaflet + Nominatim + OSRM
- Live driver GPS via Socket.io
- Chat + post-trip reviews
- Dark/light theme, map-first Home overlays

Known constraints (see `prd.md` §5 and the codebase analysis):

- Search is regex on address strings, not geography
- Payments are simulated
- Sockets and CORS are open (`origin: *`, no socket auth)
- README paths/ports are stale (`carpool-app/`, port `5001` vs code default `5000`)
- Almost no automated tests

---

## Principles

1. Fix correctness before adding features (seats, statuses, search).
2. Keep the free map stack unless Nominatim/OSRM become blockers.
3. One vertical slice at a time: book → track → complete should be trustworthy.
4. Do not add CI/CD or real payments until the booking core is solid.

---

## Phase 0 — Hygiene (1–2 days)

**Status: done** (port standardized on `5001`).

Unblock new work and stop confusing local setup.

| ID | Task | Done when |
|----|------|-----------|
| P0.1 | Align README with real layout (`frontend/`, `backend/`) and ports. Pick one port and document `VITE_API_URL` / `VITE_SOCKET_URL`. | ✅ Port `5001`; README matches repo |
| P0.2 | Add `backend/.env.example` (no secrets). Document Mongo local vs Atlas. | ✅ plus `frontend/.env.example` |
| P0.3 | Fix Axios 401 interceptor: only clear the token for the portal that failed; do not boot a driver to `/login`. | ✅ |
| P0.4 | Connect Socket.io only when a user/driver is logged in; disconnect on logout. | ✅ |
| P0.5 | Point `GET /api/auth/user` docs at the real route (`GET /api/auth/me`). | ✅ |

---

## Phase 1 — Booking correctness (highest priority)

**Status: done.** Re-book after cancel is allowed (decision recorded below).

The product breaks if seats and statuses lie.

| ID | Task | Done when |
|----|------|-----------|
| P1.1 | Allow `Ride.seats` to reach `0` (`min: 0`). Last seat must persist. | ✅ |
| P1.2 | Atomic seat hold: `findOneAndUpdate` with `seats: { $gt: 0 }`. No check-then-save. | ✅ |
| P1.3 | Unique booking per `(user, ride)` at the DB level (partial index on active statuses). | ✅ re-book after cancel allowed |
| P1.4 | Passenger `PUT /api/bookings/:id/status` may cancel only if status is `pending` or `confirmed`. Completing a trip is **driver-only**. | ✅ + Cancel on My Trips |
| P1.5 | Driver status machine: `pending → confirmed \| rejected`; `confirmed → in_progress → completed`; cancel rules explicit. Illegal transitions 400. | ✅ |
| P1.6 | On driver “start ride”, set `Ride.status` to `in_progress`; when no active bookings remain and at least one completed, mark ride completed. | ✅ `syncRideStatus` |
| P1.7 | Add tests: last seat, double book, concurrent book, cancel restores seat, illegal status. | ✅ `backend/tests/booking.test.js` |

---

## Phase 2 — Search and matching

Regex fallback currently dumps **all** rides when there is no string match (`Home.jsx`). That is misleading.

| ID | Task | Done when |
|----|------|-----------|
| P2.1 | Persist `sourceCoords` / `destinationCoords` (`lat`, `lng`) on `Ride` at create time. | Create-ride stores numbers, not only labels |
| P2.2 | Search by proximity (e.g. pickup within X km of ride origin **and** dropoff within Y km of ride destination), still filter future time and `seats > 0`. | Nearby rides appear even if labels differ |
| P2.3 | Stop unfiltered `GET /api/rides` as search fallback. Empty state + “widen radius” instead. | Home never lists unrelated city rides |
| P2.4 | Optional: date filter in the floating search card (backend already accepts `date`). | User can search a specific day |
| P2.5 | Debounce / cache Nominatim; respect usage policy. Show a clear error if geocoding fails. | No burst of requests per keystroke without delay |

---

## Phase 3 — Real-time and chat (trust the live layer)

| ID | Task | Done when |
|----|------|-----------|
| P3.1 | Authenticate Socket.io with the same JWT (handshake `auth.token`). Register `userId`/`driverId` from the token, not the client body. | Spoofed `driver:register` is ignored |
| P3.2 | Forward location only to passengers with an **active** booking for that driver (`confirmed` / `in_progress`). | Random `passengerId` gets nothing |
| P3.3 | Persist chat messages on `sendMessage` (today the socket path does not write Mongo; REST `sendMessage` does). One source of truth. | Refresh still shows history |
| P3.4 | Chat participants: `{ id, role: 'user' \| 'driver' }` (or two explicit refs). Authorize access via the booking. | Cannot open another pair’s chat |
| P3.5 | Emit `ride:statusUpdate` from the **booking controller** after a successful status write, not only from the driver client. | Passenger UI updates even if the driver tab dies |
| P3.6 | Passenger map: bind `driverLocation` from `SocketContext` into `MapPanel` / tracking view for the active trip. | Live marker moves during `in_progress` |

---

## Phase 4 — Pricing and payment honesty

| ID | Task | Done when |
|----|------|-----------|
| P4.1 | Compute fare **once** on the server when the ride is created (or when booking is created). Store `price` + `priceBreakdown`. Stop `Math.random()` surge at quote time on every request. | Same trip, same price |
| P4.2 | Booking uses stored ride price, not a client-sent `selectedFare`. | Tampering the payload does not change fare |
| P4.3 | Payment page: persist `paymentStatus: simulated_paid` on the booking after “pay”. Keep real Stripe **out** until Phase 6. | My Rides shows paid vs unpaid pending |
| P4.4 | Label the UI “Demo payment — no charge” so the portfolio story is accurate. | Copy matches `prd.md` |

---

## Phase 5 — Product polish (after the core is true)

Priority order; skip anything that fights Phase 1–3.

| ID | Task |
|----|------|
| P5.1 | Shared empty/error states on My Rides, driver requests, and search |
| P5.2 | Driver “active ride” panel: start / complete / navigate linked to P1.5 |
| P5.3 | After `completed`, prompt rating (passenger → driver, optional reverse) |
| P5.4 | Protect `GET /api/users` or remove it; it is not needed for the app |
| P5.5 | Mobile layout pass (map + floating cards currently desktop-first) |
| P5.6 | Optional: link or switch accounts (“also drive”) without merging schemas yet |
| P5.7 | ETA on passenger tracking using last GPS + remaining OSRM leg |

---

## Phase 6 — Production shape (later)

Only after Phases 0–4.

- Restrict CORS and Socket.io origin to the frontend URL
- Rate-limit auth, search, and Nominatim proxy (proxy geocode through the backend)
- Refresh tokens or short-lived access + httpOnly cookies (decide in `decisions.md`)
- Env-based JWT secret checks on boot; refuse default secrets
- Deploy: frontend static host + backend + MongoDB Atlas; health route `GET /health`
- CI: lint + backend tests on PR
- Real payments only if there is a legal/ops plan (KYC, refunds). Until then, keep simulated.

---

## Suggested sequence (next 2–3 weeks)

```text
Week 1:  P0 hygiene → P1.1–P1.5 booking + first tests
Week 2:  P1.6–P1.7 → P2 coords search → kill all-rides fallback
Week 3:  P3 socket JWT + live map on active booking → P4 stable fare
Then:    P5 polish for a clean demo video / portfolio walkthrough
```

Do not start Phase 6 in parallel.

---

## Open decisions (record in `decisions.md` when chosen)

1. **Re-book after cancel:** **allowed.** Partial unique index only covers `pending` / `confirmed` / `in_progress`.
2. **One active ride per driver:** enforce, or allow overlapping offers?
3. **Matching radius:** start with 2 km pickup / 3 km dropoff, tune after trying real addresses.
4. **Auth storage:** stay on `localStorage` for the demo, or move to httpOnly cookies before any public deploy.
5. **Single user record vs two collections:** keep dual portals for now; unifying roles is a later migration.

---

## Definition of a better “v1 demo”

A reviewer can:

1. Register as driver, post a ride with map pins.
2. Register as passenger (other browser/profile), search, see **only plausible** rides.
3. Book the last seat; a second passenger is refused.
4. Driver confirms → starts → passenger sees the car move.
5. Driver completes → passenger rates → My Rides shows completed + simulated paid.
6. Refresh does not lose chat or trip state.

When that path is boringly reliable, the app is ready for polish and hosting—not before.
