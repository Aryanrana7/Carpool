/**
 * Clean, premium editorial vector illustrations for CarPool Authentication Portals.
 * - Cohesive editorial illustration style across both Passenger and Driver portals
 * - Zero tiny dashboard screenshots, zero illegible labels, zero fake controls
 * - Built strictly with the CarPool design palette: emerald green, teal, warm cream, and restrained orange
 * - Standardized dimensions (viewBox="0 0 440 180") to guarantee consistent visual weight and zero layout shifts
 */

/* ─────────────────────────────────────────────────────────────
   PASSENGER EDITORIAL ILLUSTRATIONS (P1 - P6)
   ───────────────────────────────────────────────────────────── */

/** P1: Your Journey. Shared. — Car travelling along a shared route connecting commuters */
export const PassengerIllustration1 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of a shared car journey along a scenic route"
  >
    <defs>
      <linearGradient id="p1-grad-road" x1="40" y1="90" x2="400" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#087F5B" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#12B886" stopOpacity="0.9" />
        <stop offset="1" stopColor="#087F5B" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="p1-horizon" x1="220" y1="40" x2="220" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#12B886" stopOpacity="0.15" />
        <stop offset="1" stopColor="#087F5B" stopOpacity="0.0" />
      </linearGradient>
    </defs>

    {/* Subtle atmospheric horizon arc */}
    <ellipse cx="220" cy="150" rx="190" ry="70" fill="url(#p1-horizon)" />

    {/* Landscape rolling curves */}
    <path d="M 30 140 Q 130 100, 230 120 T 410 110" stroke="#25382F" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 50 160 Q 180 120, 300 135 T 410 140" stroke="#1F3028" strokeWidth="1.5" />

    {/* Primary shared route highway */}
    <path
      d="M 40 135 C 120 155, 160 70, 240 85 C 310 100, 330 140, 400 110"
      stroke="url(#p1-grad-road)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M 40 135 C 120 155, 160 70, 240 85 C 310 100, 330 140, 400 110"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="6 6"
      opacity="0.85"
    />

    {/* Commuter Pickup Waypoint (Left) */}
    <g transform="translate(100, 105)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#E8A45B" />
      <circle cx="0" cy="0" r="22" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </g>

    {/* Stylized Modern Car Silhouette (Center) */}
    <g transform="translate(225, 62)">
      {/* Car body */}
      <path
        d="M 5 24 C 7 16, 15 13, 24 13 L 42 13 C 51 13, 58 17, 62 24 L 68 25 C 72 25, 75 28, 75 32 L 75 36 C 75 38, 73 40, 71 40 L 4 40 C 2 40, 0 38, 0 36 L 0 32 C 0 28, 3 25, 5 24 Z"
        fill="#087F5B"
      />
      {/* Windows */}
      <path d="M 22 16 L 38 16 L 38 24 L 17 24 Z" fill="#D9EEE4" opacity="0.9" />
      <path d="M 42 16 L 54 16 L 58 24 L 42 24 Z" fill="#D9EEE4" opacity="0.9" />
      {/* Wheels */}
      <circle cx="18" cy="40" r="7" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="18" cy="40" r="2.5" fill="#FAF9F5" />
      <circle cx="56" cy="40" r="7" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="56" cy="40" r="2.5" fill="#FAF9F5" />
      {/* Headlight glow */}
      <path d="M 75 30 L 92 26 L 92 36 Z" fill="#E8A45B" opacity="0.35" />
    </g>

    {/* Drop-off Waypoint (Right) */}
    <g transform="translate(360, 95)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#12B886" />
      <circle cx="0" cy="0" r="22" stroke="#12B886" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </g>
  </svg>
);

/** P2: Better Routes. Smarter Rides. — Intelligent route paths and clear waypoints */
export const PassengerIllustration2 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of smart route options navigating toward a destination"
  >
    {/* Abstract topography grid */}
    <g opacity="0.2" stroke="#4E7A68" strokeWidth="1">
      <ellipse cx="220" cy="90" rx="180" ry="60" fill="none" strokeDasharray="4 6" />
      <ellipse cx="220" cy="90" rx="110" ry="36" fill="none" />
      <line x1="60" y1="90" x2="380" y2="90" strokeDasharray="3 3" />
    </g>

    {/* Alternate route curve */}
    <path
      d="M 70 130 C 130 160, 200 130, 250 145 C 310 160, 340 110, 370 70"
      stroke="#273E33"
      strokeWidth="3.5"
      strokeDasharray="5 5"
    />

    {/* Optimal Direct Emerald Corridor */}
    <path
      d="M 70 130 C 140 70, 200 50, 270 75 C 315 90, 340 85, 370 70"
      stroke="#087F5B"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M 70 130 C 140 70, 200 50, 270 75 C 315 90, 340 85, 370 70"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="6 6"
      opacity="0.85"
    />

    {/* Origin Marker */}
    <g transform="translate(70, 130)">
      <circle cx="0" cy="0" r="10" fill="#E8A45B" stroke="#FAF9F5" strokeWidth="2" />
      <circle cx="0" cy="0" r="3.5" fill="#18241F" />
    </g>

    {/* Smart Optimization Node */}
    <g transform="translate(240, 68)">
      <circle cx="0" cy="0" r="16" fill="#1E3228" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#12B886" />
      <path d="M -22 0 L 22 0" stroke="#12B886" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    </g>

    {/* Destination Pin */}
    <g transform="translate(370, 70)">
      <circle cx="0" cy="0" r="12" fill="#12B886" stroke="#FAF9F5" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="4" fill="#18241F" />
      <circle cx="0" cy="0" r="20" stroke="#12B886" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
    </g>
  </svg>
);

/** P3: Good Company. Shared Costs. — Interconnected traveller silhouettes & balance arcs */
export const PassengerIllustration3 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of people travelling together and sharing the journey"
  >
    {/* Harmony balance curve */}
    <path d="M 80 130 Q 220 50, 360 130" stroke="#087F5B" strokeWidth="3" opacity="0.5" />
    <path d="M 120 140 Q 220 80, 320 140" stroke="#E8A45B" strokeWidth="2" opacity="0.4" strokeDasharray="4 4" />

    {/* Three Passenger Silhouettes seated harmoniously */}
    {/* Passenger 1 */}
    <g transform="translate(140, 95)">
      <circle cx="0" cy="-24" r="11" fill="#D9EEE4" />
      <path d="M -16 6 C -16 -10, -8 -16, 0 -16 C 8 -16, 16 -10, 16 6 Z" fill="#087F5B" />
      <circle cx="0" cy="18" r="4" fill="#12B886" />
    </g>

    {/* Passenger 2 (Center Primary) */}
    <g transform="translate(220, 80)">
      <circle cx="0" cy="0" r="32" fill="#1F3329" stroke="#12B886" strokeWidth="1.5" opacity="0.6" />
      <circle cx="0" cy="-28" r="13" fill="#FAF9F5" />
      <path d="M -20 8 C -20 -12, -10 -19, 0 -19 C 10 -19, 20 -12, 20 8 Z" fill="#12B886" />
      <circle cx="0" cy="20" r="5" fill="#E8A45B" />
    </g>

    {/* Passenger 3 */}
    <g transform="translate(300, 95)">
      <circle cx="0" cy="-24" r="11" fill="#D9EEE4" />
      <path d="M -16 6 C -16 -10, -8 -16, 0 -16 C 8 -16, 16 -10, 16 6 Z" fill="#087F5B" />
      <circle cx="0" cy="18" r="4" fill="#12B886" />
    </g>

    {/* Shared connection line */}
    <line x1="140" y1="113" x2="300" y2="113" stroke="#FAF9F5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
  </svg>
);

/** P4: Your Schedule, Your Ride. — Minimalist time dial and rhythmic commute timeline */
export const PassengerIllustration4 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of scheduling and commute timeline"
  >
    {/* Commute timeline backbone */}
    <line x1="60" y1="90" x2="380" y2="90" stroke="#25382F" strokeWidth="3" />
    <line x1="100" y1="90" x2="320" y2="90" stroke="#087F5B" strokeWidth="4" strokeLinecap="round" />

    {/* Elegant minimalist schedule dial (Left/Center) */}
    <g transform="translate(130, 90)">
      <circle cx="0" cy="0" r="38" fill="#162921" stroke="#087F5B" strokeWidth="2" />
      <circle cx="0" cy="0" r="30" stroke="#263E32" strokeWidth="1" strokeDasharray="3 3" />
      {/* Clock hands */}
      <line x1="0" y1="0" x2="0" y2="-18" stroke="#FAF9F5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="14" y2="0" stroke="#E8A45B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="4" fill="#12B886" />
    </g>

    {/* Milestone 1 — Morning Departure */}
    <g transform="translate(230, 90)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#12B886" />
      <path d="M 0 -22 L 0 -14" stroke="#12B886" strokeWidth="2" />
    </g>

    {/* Milestone 2 — Confirmed Arrival */}
    <g transform="translate(320, 90)">
      <circle cx="0" cy="0" r="16" fill="#18241F" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#E8A45B" />
      <circle cx="0" cy="0" r="26" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </g>
  </svg>
);

/** P5: Know Your Route. Enjoy the Ride. — Navigation compass radar & trajectory */
export const PassengerIllustration5 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of navigation tracking and real-time route progress"
  >
    {/* Concentric radar beacon rings */}
    <g transform="translate(150, 90)">
      <circle cx="0" cy="0" r="65" stroke="#1F3329" strokeWidth="1" />
      <circle cx="0" cy="0" r="46" stroke="#284235" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="0" cy="0" r="26" fill="#172A22" stroke="#087F5B" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="8" fill="#12B886" />
      {/* Sweeping angle ray */}
      <line x1="0" y1="0" x2="42" y2="-42" stroke="#12B886" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Forward navigation path */}
    <path
      d="M 150 90 C 230 40, 270 140, 360 80"
      stroke="#087F5B"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M 150 90 C 230 40, 270 140, 360 80"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.8"
    />

    {/* Destination Pin */}
    <g transform="translate(360, 80)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#E8A45B" />
      <circle cx="0" cy="0" r="24" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
    </g>
  </svg>
);

/** P6: Every Commute Connects Us. — Urban community transit constellation */
export const PassengerIllustration6 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of interconnected commuter network"
  >
    {/* Network web lines */}
    <g stroke="#243A2F" strokeWidth="1.5">
      <line x1="80" y1="80" x2="180" y2="120" />
      <line x1="180" y1="120" x2="260" y2="55" />
      <line x1="260" y1="55" x2="360" y2="90" />
      <line x1="180" y1="120" x2="310" y2="135" />
      <line x1="310" y1="135" x2="360" y2="90" />
    </g>

    {/* Active corridor glow */}
    <path d="M 80 80 L 180 120 L 260 55 L 360 90" stroke="#087F5B" strokeWidth="3" strokeLinecap="round" />

    {/* Hub Nodes */}
    <g transform="translate(80, 80)">
      <circle cx="0" cy="0" r="12" fill="#18241F" stroke="#087F5B" strokeWidth="2" />
      <circle cx="0" cy="0" r="4.5" fill="#087F5B" />
    </g>

    <g transform="translate(180, 120)">
      <circle cx="0" cy="0" r="16" fill="#1E3328" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#12B886" />
    </g>

    <g transform="translate(260, 55)">
      <circle cx="0" cy="0" r="18" fill="#1E3328" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="7" fill="#E8A45B" />
      <circle cx="0" cy="0" r="28" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
    </g>

    <g transform="translate(310, 135)">
      <circle cx="0" cy="0" r="11" fill="#18241F" stroke="#087F5B" strokeWidth="2" />
      <circle cx="0" cy="0" r="4" fill="#087F5B" />
    </g>

    <g transform="translate(360, 90)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#12B886" />
    </g>
  </svg>
);


/* ─────────────────────────────────────────────────────────────
   DRIVER EDITORIAL ILLUSTRATIONS (D1 - D6)
   ───────────────────────────────────────────────────────────── */

/** D1: Your Route. Your Rules. — Driver steering silhouette & open winding route */
export const DriverIllustration1 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of driver autonomy and open scenic route"
  >
    {/* Horizon and open roadway */}
    <path d="M 50 145 C 130 160, 180 80, 260 90 C 330 100, 360 140, 400 120" stroke="#087F5B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50 145 C 130 160, 180 80, 260 90 C 330 100, 360 140, 400 120" stroke="#FAF9F5" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.85" />

    {/* Driver Steering wheel emblem (Left) */}
    <g transform="translate(120, 85)">
      <circle cx="0" cy="0" r="34" fill="#162921" stroke="#087F5B" strokeWidth="3" />
      <circle cx="0" cy="0" r="22" stroke="#253D32" strokeWidth="1.5" />
      {/* Steering spokes */}
      <line x1="-32" y1="0" x2="-8" y2="0" stroke="#FAF9F5" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="0" x2="32" y2="0" stroke="#FAF9F5" strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="8" x2="0" y2="32" stroke="#FAF9F5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="0" r="8" fill="#12B886" />
    </g>

    {/* Autonomy Waypoint Node */}
    <g transform="translate(290, 85)">
      <circle cx="0" cy="0" r="16" fill="#18241F" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#E8A45B" />
      <circle cx="0" cy="0" r="26" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </g>
  </svg>
);

/** D2: Empty Seats. Shared Journeys. — Minimalist car profile & illuminated passenger seats */
export const DriverIllustration2 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of vehicle capacity and available seats"
  >
    {/* Architectural car profile outline */}
    <path
      d="M 90 125 C 105 95, 150 70, 200 70 L 270 70 C 310 70, 340 95, 355 125 Z"
      fill="#162921"
      stroke="#273E32"
      strokeWidth="2"
    />

    {/* Driver Seat (Solid Emerald) */}
    <g transform="translate(155, 105)">
      <rect x="-14" y="-20" width="28" height="28" rx="6" fill="#087F5B" />
      <circle cx="0" cy="-6" r="4" fill="#FAF9F5" />
    </g>

    {/* Shared Passenger Seat 1 (Warm Active Teal) */}
    <g transform="translate(210, 105)">
      <rect x="-14" y="-20" width="28" height="28" rx="6" fill="#1E362B" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="-6" r="4" fill="#12B886" />
    </g>

    {/* Shared Passenger Seat 2 (Warm Active Amber) */}
    <g transform="translate(265, 105)">
      <rect x="-14" y="-20" width="28" height="28" rx="6" fill="#1E362B" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="-6" r="4" fill="#E8A45B" />
    </g>

    {/* Wheels */}
    <circle cx="130" cy="135" r="14" fill="#18241F" stroke="#087F5B" strokeWidth="2.5" />
    <circle cx="310" cy="135" r="14" fill="#18241F" stroke="#087F5B" strokeWidth="2.5" />

    {/* Capacity radiance arcs */}
    <path d="M 190 55 Q 240 40, 290 55" stroke="#12B886" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
  </svg>
);

/** D3: Plan Ahead. Drive Smarter. — Calendar geometry blending into highway corridor */
export const DriverIllustration3 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of scheduling and smart dispatch planning"
  >
    {/* Geometric planner rays */}
    <g transform="translate(130, 90)">
      <rect x="-42" y="-36" width="84" height="72" rx="10" fill="#162921" stroke="#087F5B" strokeWidth="2" />
      <line x1="-42" y1="-14" x2="42" y2="-14" stroke="#263E32" strokeWidth="1.5" />
      {/* Date markers */}
      <circle cx="-20" cy="8" r="5" fill="#087F5B" />
      <circle cx="0" cy="8" r="5" fill="#12B886" />
      <circle cx="20" cy="8" r="5" fill="#E8A45B" />
      {/* Calendar top ring anchors */}
      <rect x="-24" y="-42" width="6" height="10" rx="3" fill="#FAF9F5" />
      <rect x="18" y="-42" width="6" height="10" rx="3" fill="#FAF9F5" />
    </g>

    {/* Flowing route toward scheduled destination */}
    <path
      d="M 180 90 C 240 60, 270 120, 360 85"
      stroke="#087F5B"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M 180 90 C 240 60, 270 120, 360 85"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.8"
    />

    {/* Departure Target Waypoint */}
    <g transform="translate(360, 85)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#12B886" />
      <circle cx="0" cy="0" r="24" stroke="#12B886" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
    </g>
  </svg>
);

/** D4: Your Route Has Room for More. — Converging commute paths and matched pickups */
export const DriverIllustration4 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of matching passenger pickups along a route"
  >
    {/* Main Highway Route */}
    <path
      d="M 50 120 C 130 135, 180 60, 270 75 C 330 85, 360 125, 400 105"
      stroke="#087F5B"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M 50 120 C 130 135, 180 60, 270 75 C 330 85, 360 125, 400 105"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="5 5"
      opacity="0.85"
    />

    {/* Secondary feeder path merging seamlessly */}
    <path
      d="M 110 50 C 150 75, 160 85, 200 90"
      stroke="#E8A45B"
      strokeWidth="2.5"
      strokeDasharray="4 4"
    />

    {/* Passenger Pickup Node 1 */}
    <g transform="translate(190, 88)">
      <circle cx="0" cy="0" r="14" fill="#18241F" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#E8A45B" />
      <circle cx="0" cy="0" r="22" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </g>

    {/* Driver Vehicle Position */}
    <g transform="translate(280, 78)">
      <circle cx="0" cy="0" r="16" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#12B886" />
    </g>

    {/* Destination Corridor */}
    <g transform="translate(380, 110)">
      <circle cx="0" cy="0" r="12" fill="#18241F" stroke="#087F5B" strokeWidth="2" />
      <circle cx="0" cy="0" r="4" fill="#087F5B" />
    </g>
  </svg>
);

/** D5: Stay in Control of Every Ride. — Clean telemetry dial & route management vectors */
export const DriverIllustration5 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of driver console management and trip status"
  >
    {/* Center Telemetry Compass Dial */}
    <g transform="translate(220, 90)">
      <circle cx="0" cy="0" r="58" stroke="#21382C" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="42" fill="#162921" stroke="#087F5B" strokeWidth="2" />
      <circle cx="0" cy="0" r="28" stroke="#12B886" strokeWidth="1" strokeDasharray="3 3" />
      {/* Dynamic needle */}
      <line x1="0" y1="0" x2="20" y2="-20" stroke="#FAF9F5" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="5" fill="#12B886" />
    </g>

    {/* Lateral Status Arcs */}
    <g transform="translate(100, 90)">
      <circle cx="0" cy="0" r="22" fill="#18241F" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="7" fill="#12B886" />
      <line x1="22" y1="0" x2="62" y2="0" stroke="#087F5B" strokeWidth="2" strokeDasharray="3 3" />
    </g>

    <g transform="translate(340, 90)">
      <circle cx="0" cy="0" r="22" fill="#18241F" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="7" fill="#E8A45B" />
      <line x1="-62" y1="0" x2="-22" y2="0" stroke="#E8A45B" strokeWidth="2" strokeDasharray="3 3" />
    </g>
  </svg>
);

/** D6: Drive Together. Go Further. — Scenic highway perspective leading to glowing sunrise */
export const DriverIllustration6 = () => (
  <svg
    viewBox="0 0 440 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[150px] sm:h-[160px] select-none"
    role="img"
    aria-label="Editorial illustration of open scenic highway leading toward the horizon"
  >
    {/* Horizon line & mountain contours */}
    <path d="M 30 100 Q 120 80, 220 95 T 410 90 V 160 H 30 Z" fill="#162921" opacity="0.6" />

    {/* Scenic Sunrise Beacon */}
    <circle cx="220" cy="75" r="20" fill="#E8A45B" fillOpacity="0.85" />
    <circle cx="220" cy="75" r="32" stroke="#E8A45B" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

    {/* Highway perspective expanding outward */}
    <path d="M 220 90 L 100 165 H 340 L 220 90 Z" fill="#122019" />
    <path d="M 220 90 L 220 165" stroke="#FAF9F5" strokeWidth="2.5" strokeDasharray="6 6" />
    <line x1="220" y1="90" x2="100" y2="165" stroke="#087F5B" strokeWidth="3" />
    <line x1="220" y1="90" x2="340" y2="165" stroke="#087F5B" strokeWidth="3" />

    {/* Commuter Convergence Rings */}
    <ellipse cx="220" cy="135" rx="55" ry="12" stroke="#12B886" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
  </svg>
);
