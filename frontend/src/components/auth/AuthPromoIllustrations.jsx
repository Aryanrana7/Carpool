/**
 * AuthPromoIllustrations.jsx
 *
 * Immersive, high-fidelity vector illustrations for CarPool Authentication Portals.
 * - Cohesive editorial mobility style across both Passenger and Driver portals
 * - Deep forest-green backgrounds, luminous teal route corridors (#7EAA93), warm amber highlights (#DF8220)
 * - Standardized dimensions (viewBox="0 0 520 240") ensuring consistent visual weight and zero layout shift
 * - Layered spatial depth: atmospheric glow, topographical curves, route highways, animated dashes, and pulsing waypoints
 * - Clear mobility focal points: sleek vehicles, route corridors, telemetry HUDs, and connected commuters
 */

/* ─────────────────────────────────────────────────────────────
   PASSENGER EDITORIAL MOBILITY SCENES (P1 - P6)
   ───────────────────────────────────────────────────────────── */

/** P1: Your Journey. Shared. — Aerodynamic car gliding along an illuminated shared highway */
export const PassengerIllustration1 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Shared mobility scene showing a car cruising along an illuminated highway with commuter pickup and dropoff points"
  >
    <defs>
      <linearGradient id="p1-road-glow" x1="40" y1="180" x2="480" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" stopOpacity="0.2" />
        <stop offset="0.45" stopColor="#7EAA93" stopOpacity="0.95" />
        <stop offset="1" stopColor="#315B45" stopOpacity="0.3" />
      </linearGradient>
      <radialGradient id="p1-ambient" cx="260" cy="110" r="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="0.6" stopColor="#315B45" stopOpacity="0.05" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="p1-headlight" x1="290" y1="102" x2="400" y2="122" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DF8220" stopOpacity="0.65" />
        <stop offset="0.7" stopColor="#DF8220" stopOpacity="0.15" />
        <stop offset="1" stopColor="#DF8220" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="p1-car-body" x1="210" y1="90" x2="295" y2="115" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5B96C2" />
        <stop offset="0.6" stopColor="#315B45" />
        <stop offset="1" stopColor="#35678F" />
      </linearGradient>
    </defs>

    {/* Ambient illumination background */}
    <rect width="520" height="240" rx="16" fill="url(#p1-ambient)" />

    {/* Topography contours and coordinate grid */}
    <g opacity="0.18" stroke="#7EAA93" strokeWidth="1">
      <path d="M 20 200 Q 140 140, 270 170 T 500 150" fill="none" strokeDasharray="3 4" />
      <path d="M 40 70 Q 200 40, 360 85 T 500 60" fill="none" strokeDasharray="4 6" />
      <circle cx="120" cy="65" r="1.5" fill="#7EAA93" />
      <circle cx="420" cy="50" r="1.5" fill="#7EAA93" />
      <circle cx="340" cy="205" r="1.5" fill="#7EAA93" />
    </g>

    {/* Secondary feeder path merging into highway */}
    <path
      d="M 60 85 C 100 115, 130 145, 175 150"
      stroke="#DF8220"
      strokeWidth="2.5"
      strokeDasharray="4 4"
      opacity="0.6"
    />

    {/* Road bed shadow / depth */}
    <path
      d="M 40 185 C 130 205, 180 120, 270 115 C 360 110, 400 160, 485 125"
      stroke="#16231C"
      strokeWidth="14"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* Primary Arterial Highway Ribbon */}
    <path
      d="M 40 185 C 130 205, 180 120, 270 115 C 360 110, 400 160, 485 125"
      stroke="url(#p1-road-glow)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M 40 185 C 130 205, 180 120, 270 115 C 360 110, 400 160, 485 125"
      stroke="#FAF9F5"
      strokeWidth="1.8"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.9"
    />

    {/* Pickup Waypoint (Left) */}
    <g transform="translate(115, 175)">
      <circle cx="0" cy="0" r="24" stroke="#DF8220" strokeWidth="1" strokeDasharray="4 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="15" fill="#192A20" stroke="#DF8220" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5.5" fill="#DF8220" />
      {/* Pickup pin indicator */}
      <rect x="-24" y="-32" width="48" height="17" rx="8.5" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" opacity="0.9" />
      <text x="0" y="-20" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle" letterSpacing="0.5">PICKUP</text>
    </g>

    {/* Headlight beam projecting onto road */}
    <polygon points="295,108 405,100 410,135 295,116" fill="url(#p1-headlight)" />

    {/* Modern Aerodynamic Car Silhouette (Center Focal Point) */}
    <g transform="translate(215, 92)">
      {/* Soft ground shadow */}
      <ellipse cx="44" cy="28" rx="46" ry="6" fill="#0C1512" opacity="0.8" />
      {/* Main contoured body */}
      <path
        d="M 6 20 C 10 11, 20 8, 32 8 L 56 8 C 68 8, 77 12, 82 20 L 88 22 C 92 23, 95 26, 95 30 L 95 32 C 95 34, 93 35, 91 35 L 5 35 C 2 35, 0 33, 0 31 L 0 27 C 0 23, 3 20, 6 20 Z"
        fill="url(#p1-car-body)"
      />
      {/* Sleek roofline & glass */}
      <path d="M 28 10 L 50 10 L 52 19 L 22 19 Z" fill="#D9EEE4" opacity="0.92" />
      <path d="M 54 10 L 70 10 L 76 19 L 56 19 Z" fill="#D9EEE4" opacity="0.92" />
      {/* Aerodynamic beltline chrome accent */}
      <line x1="8" y1="21" x2="88" y2="21" stroke="#FAF9F5" strokeWidth="1" opacity="0.75" />
      {/* Alloy Wheels */}
      <g transform="translate(24, 34)">
        <circle cx="0" cy="0" r="8.5" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="3.5" fill="#FAF9F5" />
      </g>
      <g transform="translate(73, 34)">
        <circle cx="0" cy="0" r="8.5" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="3.5" fill="#FAF9F5" />
      </g>
      {/* Amber Front Headlamp & Taillamp */}
      <rect x="91" y="24" width="4" height="4" rx="1.5" fill="#DF8220" />
      <rect x="0" y="24" width="3" height="4" rx="1" fill="#FF6B6B" opacity="0.9" />
    </g>

    {/* Destination Hub (Right) */}
    <g transform="translate(440, 130)">
      <circle cx="0" cy="0" r="26" stroke="#7EAA93" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
      {/* Arrival Pin Label */}
      <rect x="-26" y="-32" width="52" height="17" rx="8.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" opacity="0.9" />
      <text x="0" y="-20" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle" letterSpacing="0.5">ARRIVAL</text>
    </g>
  </svg>
);

/** P2: Better Routes. Smarter Rides. — Direct intelligent route comparison with optimization junction */
export const PassengerIllustration2 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Route comparison showing an optimal CarPool corridor versus an indirect traditional route"
  >
    <defs>
      <radialGradient id="p2-ambient" cx="260" cy="120" r="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.12" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="p2-direct-route" x1="60" y1="160" x2="450" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" />
        <stop offset="0.5" stopColor="#7EAA93" />
        <stop offset="1" stopColor="#315B45" />
      </linearGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#p2-ambient)" />

    {/* Topography routing grid */}
    <g opacity="0.15" stroke="#7EAA93" strokeWidth="1">
      <ellipse cx="260" cy="120" rx="220" ry="80" strokeDasharray="4 6" />
      <ellipse cx="260" cy="120" rx="140" ry="48" />
      <line x1="60" y1="120" x2="460" y2="120" strokeDasharray="3 4" />
    </g>

    {/* Indirect / Longer Alternative Path (Dim Muted) */}
    <path
      d="M 65 160 C 130 205, 200 175, 270 195 C 340 215, 390 145, 450 85"
      stroke="#273E33"
      strokeWidth="4"
      strokeDasharray="5 5"
      opacity="0.75"
    />
    <text x="310" y="218" fill="#66756D" fontSize="9" fontWeight="600" letterSpacing="0.4">Standard +24 min</text>

    {/* Optimized Direct Emerald Corridor */}
    <path
      d="M 65 160 C 150 80, 220 60, 310 95 C 370 115, 400 100, 450 85"
      stroke="url(#p2-direct-route)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M 65 160 C 150 80, 220 60, 310 95 C 370 115, 400 100, 450 85"
      stroke="#FAF9F5"
      strokeWidth="1.8"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.9"
    />

    {/* Origin Waypoint */}
    <g transform="translate(65, 160)">
      <circle cx="0" cy="0" r="18" stroke="#DF8220" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="12" fill="#192A20" stroke="#DF8220" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="4.5" fill="#DF8220" />
      <text x="0" y="26" fill="#DF8220" fontSize="9" fontWeight="700" textAnchor="middle">ORIGIN</text>
    </g>

    {/* Central Smart Optimization Junction */}
    <g transform="translate(255, 78)">
      <circle cx="0" cy="0" r="28" fill="#16231C" stroke="#7EAA93" strokeWidth="1" opacity="0.5" />
      <circle cx="0" cy="0" r="18" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <polygon points="0,-7 7,0 0,7 -7,0" fill="#7EAA93" />
      {/* Optimization Tag */}
      <rect x="-42" y="-36" width="84" height="19" rx="9.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" />
      <text x="0" y="-23" fill="#7EAA93" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.4">SMART MATCH</text>
    </g>

    {/* Vehicle in motion along the optimal corridor */}
    <g transform="translate(350, 100)">
      <ellipse cx="18" cy="8" rx="20" ry="3" fill="#0E1714" opacity="0.7" />
      <rect x="0" y="0" width="36" height="14" rx="4" fill="#315B45" />
      <rect x="8" y="2" width="10" height="5" rx="1.5" fill="#D9EEE4" />
      <rect x="20" y="2" width="10" height="5" rx="1.5" fill="#D9EEE4" />
      <circle cx="9" cy="14" r="3.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
      <circle cx="27" cy="14" r="3.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
      <circle cx="36" cy="8" r="1.5" fill="#DF8220" />
    </g>

    {/* Destination Waypoint */}
    <g transform="translate(450, 85)">
      <circle cx="0" cy="0" r="22" stroke="#7EAA93" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="14" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5" fill="#7EAA93" />
      <text x="0" y="26" fill="#7EAA93" fontSize="9" fontWeight="700" textAnchor="middle">DESTINATION</text>
    </g>
  </svg>
);

/** P3: Good Company. Shared Costs. — Shared vehicle interior with collaborative cost-splitting balance */
export const PassengerIllustration3 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Three co-travellers in a modern vehicle sharing the journey and eligible travel costs"
  >
    <defs>
      <radialGradient id="p3-ambient" cx="260" cy="115" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="0.6" stopColor="#DF8220" stopOpacity="0.06" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="p3-balance-arc" x1="100" y1="160" x2="420" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" />
        <stop offset="0.5" stopColor="#DF8220" />
        <stop offset="1" stopColor="#315B45" />
      </linearGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#p3-ambient)" />

    {/* Highway horizon curve visible through rear glass */}
    <path d="M 60 70 Q 260 30, 460 70" stroke="#253E32" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
    <path d="M 40 180 Q 260 110, 480 180" stroke="url(#p3-balance-arc)" strokeWidth="3" opacity="0.6" />

    {/* Vehicle Interior Cabin Outline */}
    <path
      d="M 90 190 C 110 95, 170 55, 260 55 C 350 55, 410 95, 430 190 Z"
      fill="#14231C"
      stroke="#2E4760"
      strokeWidth="2.5"
    />

    {/* Co-Traveller 1 (Left Seat) */}
    <g transform="translate(170, 125)">
      <ellipse cx="0" cy="40" rx="22" ry="6" fill="#0F1714" opacity="0.6" />
      <circle cx="0" cy="-28" r="14" fill="#D9EEE4" />
      <path d="M -20 12 C -20 -10, -10 -18, 0 -18 C 10 -18, 20 -10, 20 12 Z" fill="#315B45" />
      <circle cx="0" cy="22" r="5" fill="#7EAA93" />
      {/* Fair split chip */}
      <rect x="-24" y="32" width="48" height="16" rx="8" fill="#192A20" stroke="#7EAA93" strokeWidth="1" />
      <text x="0" y="43" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">1/3 SHARE</text>
    </g>

    {/* Co-Traveller 2 (Center Primary Driver / Host) */}
    <g transform="translate(260, 110)">
      <ellipse cx="0" cy="55" rx="26" ry="7" fill="#0F1714" opacity="0.8" />
      <circle cx="0" cy="0" r="42" fill="#1A2D23" stroke="#DF8220" strokeWidth="1.5" opacity="0.5" />
      <circle cx="0" cy="-34" r="16" fill="#FAF9F5" />
      <path d="M -24 16 C -24 -12, -12 -22, 0 -22 C 12 -22, 24 -12, 24 16 Z" fill="#7EAA93" />
      <circle cx="0" cy="28" r="6" fill="#DF8220" />
      {/* Fair split chip */}
      <rect x="-26" y="44" width="52" height="17" rx="8.5" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" />
      <text x="0" y="56" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle">1/3 SHARE</text>
    </g>

    {/* Co-Traveller 3 (Right Seat) */}
    <g transform="translate(350, 125)">
      <ellipse cx="0" cy="40" rx="22" ry="6" fill="#0F1714" opacity="0.6" />
      <circle cx="0" cy="-28" r="14" fill="#D9EEE4" />
      <path d="M -20 12 C -20 -10, -10 -18, 0 -18 C 10 -18, 20 -10, 20 12 Z" fill="#315B45" />
      <circle cx="0" cy="22" r="5" fill="#7EAA93" />
      {/* Fair split chip */}
      <rect x="-24" y="32" width="48" height="16" rx="8" fill="#192A20" stroke="#7EAA93" strokeWidth="1" />
      <text x="0" y="43" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">1/3 SHARE</text>
    </g>

    {/* Interconnected cost-sharing balance line */}
    <line x1="170" y1="147" x2="350" y2="147" stroke="#FAF9F5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" />
  </svg>
);

/** P4: Your Schedule, Your Ride. — Dynamic commute timeline & chronometer milestones */
export const PassengerIllustration4 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Commute scheduling timeline with departure, pickup, and arrival milestones"
  >
    <defs>
      <radialGradient id="p4-ambient" cx="260" cy="120" r="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.12" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#p4-ambient)" />

    {/* Route Corridor Backbone */}
    <path
      d="M 50 120 C 130 120, 170 120, 470 120"
      stroke="#20342A"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M 120 120 L 460 120"
      stroke="#315B45"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M 120 120 L 460 120"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.85"
    />

    {/* Luminous Chronometer Schedule Dial (Left) */}
    <g transform="translate(105, 120)">
      <circle cx="0" cy="0" r="48" fill="#16231C" stroke="#315B45" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="38" stroke="#253E32" strokeWidth="1" strokeDasharray="3 4" />
      {/* Hour ticks */}
      <line x1="0" y1="-34" x2="0" y2="-28" stroke="#7EAA93" strokeWidth="2" />
      <line x1="34" y1="0" x2="28" y2="0" stroke="#7EAA93" strokeWidth="2" />
      <line x1="0" y1="34" x2="0" y2="28" stroke="#7EAA93" strokeWidth="2" />
      <line x1="-34" y1="0" x2="-28" y2="0" stroke="#7EAA93" strokeWidth="2" />
      {/* Clock hands */}
      <line x1="0" y1="0" x2="0" y2="-20" stroke="#FAF9F5" strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="0" x2="16" y2="0" stroke="#DF8220" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="4.5" fill="#7EAA93" />
      <text x="0" y="60" fill="#7EAA93" fontSize="9" fontWeight="700" textAnchor="middle">08:15 AM</text>
    </g>

    {/* Milestone 1: Pickup */}
    <g transform="translate(225, 120)">
      <circle cx="0" cy="0" r="18" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
      <rect x="-30" y="-38" width="60" height="18" rx="9" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" />
      <text x="0" y="-26" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">PICKUP</text>
      <text x="0" y="32" fill="#FAF9F5" fontSize="8.5" fontWeight="600" textAnchor="middle">08:25 AM</text>
    </g>

    {/* Moving Car Icon between Milestones */}
    <g transform="translate(285, 105)">
      <rect x="0" y="0" width="36" height="14" rx="4" fill="#315B45" />
      <rect x="8" y="2" width="10" height="5" rx="1.5" fill="#D9EEE4" />
      <rect x="20" y="2" width="10" height="5" rx="1.5" fill="#D9EEE4" />
      <circle cx="9" cy="14" r="3" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
      <circle cx="27" cy="14" r="3" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
    </g>

    {/* Milestone 2: Transit Corridor */}
    <g transform="translate(355, 120)">
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#DF8220" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5.5" fill="#DF8220" />
      <rect x="-30" y="-38" width="60" height="18" rx="9" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" />
      <text x="0" y="-26" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle">CORRIDOR</text>
      <text x="0" y="32" fill="#FAF9F5" fontSize="8.5" fontWeight="600" textAnchor="middle">08:45 AM</text>
    </g>

    {/* Milestone 3: Confirmed Arrival */}
    <g transform="translate(455, 120)">
      <circle cx="0" cy="0" r="22" stroke="#7EAA93" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="15" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5" fill="#7EAA93" />
      <rect x="-28" y="-38" width="56" height="18" rx="9" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" />
      <text x="0" y="-26" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">ARRIVAL</text>
      <text x="0" y="32" fill="#FAF9F5" fontSize="8.5" fontWeight="600" textAnchor="middle">09:05 AM</text>
    </g>
  </svg>
);

/** P5: Know Your Route. Enjoy the Ride. — GPS telemetry radar HUD with active route trajectory */
export const PassengerIllustration5 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Live navigation telemetry radar HUD displaying real-time ride tracking and ETA"
  >
    <defs>
      <radialGradient id="p5-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="p5-trajectory" x1="150" y1="120" x2="440" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" />
        <stop offset="0.6" stopColor="#7EAA93" />
        <stop offset="1" stopColor="#DF8220" />
      </linearGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#p5-ambient)" />

    {/* Telemetry Radar Rings (Left) */}
    <g transform="translate(140, 120)">
      <circle cx="0" cy="0" r="80" stroke="#1D3328" strokeWidth="1" />
      <circle cx="0" cy="0" r="56" stroke="#264235" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="0" cy="0" r="32" fill="#16231C" stroke="#315B45" strokeWidth="2" />
      <circle cx="0" cy="0" r="8" fill="#7EAA93" />
      {/* Radar sweeping ray */}
      <line x1="0" y1="0" x2="52" y2="-52" stroke="#7EAA93" strokeWidth="2" strokeLinecap="round" />
      <polygon points="46,-56 56,-46 56,-56" fill="#7EAA93" opacity="0.6" />
      <text x="0" y="98" fill="#7EAA93" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.4">LIVE RADAR 360°</text>
    </g>

    {/* Forward Trajectory Highway Ribbon */}
    <path
      d="M 140 120 C 230 65, 290 175, 430 100"
      stroke="url(#p5-trajectory)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M 140 120 C 230 65, 290 175, 430 100"
      stroke="#FAF9F5"
      strokeWidth="1.8"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.9"
    />

    {/* Live Vehicle Tracking Marker */}
    <g transform="translate(275, 125)">
      <ellipse cx="14" cy="18" rx="20" ry="4" fill="#0E1613" opacity="0.7" />
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#7EAA93" strokeWidth="2" />
      <polygon points="0,-7 6,5 0,2 -6,5" fill="#7EAA93" />
      {/* Real-time telemetry pill */}
      <rect x="-35" y="-32" width="70" height="18" rx="9" fill="#192A20" stroke="#7EAA93" strokeWidth="1" />
      <text x="0" y="-20" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">ETA 12 MIN</text>
    </g>

    {/* Destination Pin Beacon */}
    <g transform="translate(430, 100)">
      <circle cx="0" cy="0" r="28" stroke="#DF8220" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#DF8220" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#DF8220" />
      <rect x="-30" y="-34" width="60" height="18" rx="9" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" />
      <text x="0" y="-22" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle">ARRIVING</text>
    </g>
  </svg>
);

/** P6: Every Commute Connects Us. — Interconnected urban commuter constellation network */
export const PassengerIllustration6 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Urban commuter network constellation connecting daily travellers across neighborhoods"
  >
    <defs>
      <radialGradient id="p6-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#p6-ambient)" />

    {/* Background Network Mesh */}
    <g stroke="#223B2F" strokeWidth="1.5">
      <line x1="70" y1="90" x2="180" y2="150" />
      <line x1="180" y1="150" x2="280" y2="70" />
      <line x1="280" y1="70" x2="380" y2="150" />
      <line x1="380" y1="150" x2="450" y2="80" />
      <line x1="180" y1="150" x2="380" y2="150" strokeDasharray="3 3" />
      <line x1="70" y1="90" x2="280" y2="70" strokeDasharray="4 4" />
    </g>

    {/* Primary Glowing Corridor Arteries */}
    <path
      d="M 70 90 L 180 150 L 280 70 L 380 150 L 450 80"
      stroke="#315B45"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 70 90 L 180 150 L 280 70 L 380 150 L 450 80"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="5 5"
      className="animate-dash-flow"
      opacity="0.85"
    />

    {/* Node 1: North West Hub */}
    <g transform="translate(70, 90)">
      <circle cx="0" cy="0" r="14" fill="#192A20" stroke="#315B45" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5" fill="#315B45" />
      <text x="0" y="-18" fill="#D9EEE4" fontSize="8" fontWeight="600" textAnchor="middle">ZONE 1</text>
    </g>

    {/* Node 2: West Station */}
    <g transform="translate(180, 150)">
      <circle cx="0" cy="0" r="18" fill="#162920" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="7" fill="#7EAA93" />
      <text x="0" y="28" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">METRO HUB</text>
    </g>

    {/* Node 3: Central Transit Concourse (Primary Focal Hub) */}
    <g transform="translate(280, 70)">
      <circle cx="0" cy="0" r="32" stroke="#DF8220" strokeWidth="1" strokeDasharray="4 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="20" fill="#192A20" stroke="#DF8220" strokeWidth="3" />
      <circle cx="0" cy="0" r="8" fill="#DF8220" />
      <rect x="-34" y="-36" width="68" height="18" rx="9" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" />
      <text x="0" y="-24" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle">CENTRAL HUB</text>
    </g>

    {/* Node 4: East Junction */}
    <g transform="translate(380, 150)">
      <circle cx="0" cy="0" r="16" fill="#162920" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
      <text x="0" y="28" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">EAST LINK</text>
    </g>

    {/* Node 5: Destination Campus */}
    <g transform="translate(450, 80)">
      <circle cx="0" cy="0" r="15" fill="#192A20" stroke="#315B45" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5.5" fill="#315B45" />
      <text x="0" y="-18" fill="#D9EEE4" fontSize="8" fontWeight="600" textAnchor="middle">ZONE 5</text>
    </g>
  </svg>
);


/* ─────────────────────────────────────────────────────────────
   DRIVER EDITORIAL MOBILITY SCENES (D1 - D6)
   ───────────────────────────────────────────────────────────── */

/** D1: Your Route. Your Rules. — Driver steering cockpit & scenic highway pass */
export const DriverIllustration1 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Driver operations cockpit perspective with steering emblem, dashboard controls, and open scenic route"
  >
    <defs>
      <radialGradient id="d1-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="d1-road-glow" x1="120" y1="180" x2="480" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" />
        <stop offset="0.6" stopColor="#7EAA93" />
        <stop offset="1" stopColor="#DF8220" />
      </linearGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#d1-ambient)" />

    {/* Horizon line & mountain contours */}
    <path d="M 40 110 Q 150 75, 270 95 T 480 80" stroke="#223B2F" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

    {/* Open Highway Route unfolding into horizon */}
    <path
      d="M 120 185 C 200 200, 240 100, 340 110 C 410 118, 440 160, 480 120"
      stroke="url(#d1-road-glow)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M 120 185 C 200 200, 240 100, 340 110 C 410 118, 440 160, 480 120"
      stroke="#FAF9F5"
      strokeWidth="1.8"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.85"
    />

    {/* Modern High-Tech Steering Cockpit Emblem (Left) */}
    <g transform="translate(130, 115)">
      <circle cx="0" cy="0" r="46" fill="#16231C" stroke="#315B45" strokeWidth="3.5" />
      <circle cx="0" cy="0" r="32" stroke="#264235" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Steering spokes */}
      <line x1="-42" y1="0" x2="-12" y2="0" stroke="#FAF9F5" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="12" y1="0" x2="42" y2="0" stroke="#FAF9F5" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="0" y1="12" x2="0" y2="42" stroke="#FAF9F5" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="10" fill="#7EAA93" />
      {/* Autonomy Badge */}
      <rect x="-35" y="54" width="70" height="18" rx="9" fill="#192A20" stroke="#315B45" strokeWidth="1.2" />
      <text x="0" y="66" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">AUTONOMY</text>
    </g>

    {/* Driver Route Waypoint (Center) */}
    <g transform="translate(340, 110)">
      <circle cx="0" cy="0" r="22" stroke="#7EAA93" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="14" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5" fill="#7EAA93" />
      <rect x="-32" y="-32" width="64" height="17" rx="8.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" />
      <text x="0" y="-20" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">SCHEDULED</text>
    </g>

    {/* Destination Beacon (Right) */}
    <g transform="translate(460, 120)">
      <circle cx="0" cy="0" r="26" stroke="#DF8220" strokeWidth="1" strokeDasharray="4 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="15" fill="#192A20" stroke="#DF8220" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5.5" fill="#DF8220" />
      <rect x="-30" y="-32" width="60" height="17" rx="8.5" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" />
      <text x="0" y="-20" fill="#DF8220" fontSize="8" fontWeight="700" textAnchor="middle">DESTINATION</text>
    </g>
  </svg>
);

/** D2: Empty Seats. Shared Journeys. — Detailed vehicle capacity map with illuminated available seats */
export const DriverIllustration2 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Vehicle interior capacity map highlighting driver seat and open passenger seats"
  >
    <defs>
      <radialGradient id="d2-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="0.7" stopColor="#DF8220" stopOpacity="0.06" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#d2-ambient)" />

    {/* Road Surface beneath wheels */}
    <line x1="50" y1="180" x2="470" y2="180" stroke="#253E32" strokeWidth="4" />
    <line x1="90" y1="180" x2="430" y2="180" stroke="#315B45" strokeWidth="4" />
    <line x1="90" y1="180" x2="430" y2="180" stroke="#FAF9F5" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash-flow" />

    {/* Full Architectural Vehicle Profile Outline */}
    <path
      d="M 90 165 C 105 110, 160 70, 230 70 L 330 70 C 390 70, 420 110, 440 165 Z"
      fill="#14241D"
      stroke="#2E4760"
      strokeWidth="2.5"
    />

    {/* Driver Seat (Solid Emerald Active) */}
    <g transform="translate(165, 115)">
      <rect x="-18" y="-24" width="36" height="36" rx="8" fill="#315B45" stroke="#7EAA93" strokeWidth="2" />
      <circle cx="0" cy="-6" r="6" fill="#FAF9F5" />
      <text x="0" y="26" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">DRIVER</text>
    </g>

    {/* Passenger Seat 1 (Co-Commuter Connected) */}
    <g transform="translate(245, 115)">
      <rect x="-18" y="-24" width="36" height="36" rx="8" fill="#193327" stroke="#7EAA93" strokeWidth="2" />
      <circle cx="0" cy="-6" r="6" fill="#7EAA93" />
      <text x="0" y="26" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">SEAT 1</text>
    </g>

    {/* Passenger Seat 2 (Available for Booking - Pulsing Warm Amber) */}
    <g transform="translate(325, 115)">
      <circle cx="0" cy="-6" r="26" stroke="#DF8220" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <rect x="-18" y="-24" width="36" height="36" rx="8" fill="#243323" stroke="#DF8220" strokeWidth="2.5" />
      <text x="0" y="-1" fill="#DF8220" fontSize="14" fontWeight="800" textAnchor="middle">+</text>
      <text x="0" y="26" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle">OPEN</text>
    </g>

    {/* Passenger Seat 3 (Rear Available Seat) */}
    <g transform="translate(390, 115)">
      <rect x="-16" y="-22" width="32" height="32" rx="7" fill="#243323" stroke="#DF8220" strokeWidth="2" opacity="0.85" />
      <text x="0" y="-1" fill="#DF8220" fontSize="13" fontWeight="800" textAnchor="middle">+</text>
      <text x="0" y="24" fill="#DF8220" fontSize="8" fontWeight="700" textAnchor="middle">OPEN</text>
    </g>

    {/* Alloy Wheels */}
    <g transform="translate(140, 175)">
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#315B45" strokeWidth="3" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
    </g>
    <g transform="translate(390, 175)">
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#315B45" strokeWidth="3" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
    </g>
  </svg>
);

/** D3: Plan Ahead. Drive Smarter. — Dispatch calendar geometry merging into departure highway */
export const DriverIllustration3 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Driver route publishing calendar and scheduled departure controls"
  >
    <defs>
      <radialGradient id="d3-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="d3-dispatch-lane" x1="180" y1="120" x2="450" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" />
        <stop offset="0.6" stopColor="#7EAA93" />
        <stop offset="1" stopColor="#DF8220" />
      </linearGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#d3-ambient)" />

    {/* Dispatch Schedule Calendar Grid (Left) */}
    <g transform="translate(120, 120)">
      <rect x="-55" y="-46" width="110" height="92" rx="12" fill="#16231C" stroke="#315B45" strokeWidth="2.5" />
      <line x1="-55" y1="-18" x2="55" y2="-18" stroke="#253E32" strokeWidth="2" />
      {/* Calendar dates / slots */}
      <circle cx="-28" cy="8" r="7" fill="#315B45" />
      <text x="-28" y="11" fill="#FAF9F5" fontSize="8" fontWeight="700" textAnchor="middle">M</text>
      <circle cx="0" cy="8" r="7" fill="#7EAA93" />
      <text x="0" y="11" fill="#FAF9F5" fontSize="8" fontWeight="700" textAnchor="middle">W</text>
      <circle cx="28" cy="8" r="7" fill="#DF8220" />
      <text x="28" y="11" fill="#192A20" fontSize="8" fontWeight="700" textAnchor="middle">F</text>
      {/* Calendar top anchors */}
      <rect x="-32" y="-52" width="8" height="12" rx="4" fill="#FAF9F5" />
      <rect x="24" y="-52" width="8" height="12" rx="4" fill="#FAF9F5" />
      <text x="0" y="-28" fill="#7EAA93" fontSize="9" fontWeight="700" textAnchor="middle">RECURRING</text>
      <text x="0" y="32" fill="#FAF9F5" fontSize="8" fontWeight="600" textAnchor="middle">07:45 AM DEPART</text>
    </g>

    {/* Open Highway projecting out from the calendar */}
    <path
      d="M 180 120 C 250 80, 290 155, 440 105"
      stroke="url(#d3-dispatch-lane)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M 180 120 C 250 80, 290 155, 440 105"
      stroke="#FAF9F5"
      strokeWidth="1.8"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.85"
    />

    {/* Intermediate Departure Waypoint */}
    <g transform="translate(300, 125)">
      <circle cx="0" cy="0" r="18" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
      <rect x="-32" y="-32" width="64" height="17" rx="8.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" />
      <text x="0" y="-20" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">CONFIRMED</text>
    </g>

    {/* Destination Arrival Pin */}
    <g transform="translate(440, 105)">
      <circle cx="0" cy="0" r="26" stroke="#DF8220" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="16" fill="#192A20" stroke="#DF8220" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5.5" fill="#DF8220" />
      <rect x="-30" y="-34" width="60" height="18" rx="9" fill="#192A20" stroke="#DF8220" strokeWidth="1.2" />
      <text x="0" y="-22" fill="#DF8220" fontSize="8.5" fontWeight="700" textAnchor="middle">SCHEDULED</text>
    </g>
  </svg>
);

/** D4: Your Route Has Room for More. — Commuter corridor with feeder pickups merging into driver path */
export const DriverIllustration4 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Commuter corridor matching passenger pickup requests along the driver route"
  >
    <defs>
      <radialGradient id="d4-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="d4-main-highway" x1="40" y1="140" x2="480" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#315B45" />
        <stop offset="0.5" stopColor="#7EAA93" />
        <stop offset="1" stopColor="#315B45" />
      </linearGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#d4-ambient)" />

    {/* Driver Primary Arterial Highway */}
    <path
      d="M 50 145 C 140 165, 190 75, 300 90 C 370 100, 420 150, 470 115"
      stroke="url(#d4-main-highway)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M 50 145 C 140 165, 190 75, 300 90 C 370 100, 420 150, 470 115"
      stroke="#FAF9F5"
      strokeWidth="1.8"
      strokeDasharray="6 6"
      className="animate-dash-flow"
      opacity="0.85"
    />

    {/* Secondary feeder path 1 (Passenger Pickup 1) */}
    <path
      d="M 120 60 C 160 85, 180 105, 220 115"
      stroke="#DF8220"
      strokeWidth="3"
      strokeDasharray="4 4"
    />
    <g transform="translate(120, 60)">
      <circle cx="0" cy="0" r="16" stroke="#DF8220" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="11" fill="#192A20" stroke="#DF8220" strokeWidth="2" />
      <circle cx="0" cy="0" r="4" fill="#DF8220" />
      <rect x="-30" y="-28" width="60" height="16" rx="8" fill="#192A20" stroke="#DF8220" strokeWidth="1" />
      <text x="0" y="-17" fill="#DF8220" fontSize="8" fontWeight="700" textAnchor="middle">PICKUP A</text>
    </g>

    {/* Secondary feeder path 2 (Passenger Pickup 2) */}
    <path
      d="M 330 195 C 345 170, 360 145, 385 125"
      stroke="#DF8220"
      strokeWidth="3"
      strokeDasharray="4 4"
    />
    <g transform="translate(330, 195)">
      <circle cx="0" cy="0" r="16" stroke="#DF8220" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="11" fill="#192A20" stroke="#DF8220" strokeWidth="2" />
      <circle cx="0" cy="0" r="4" fill="#DF8220" />
      <rect x="-30" y="16" width="60" height="16" rx="8" fill="#192A20" stroke="#DF8220" strokeWidth="1" />
      <text x="0" y="27" fill="#DF8220" fontSize="8" fontWeight="700" textAnchor="middle">PICKUP B</text>
    </g>

    {/* Driver Vehicle Position at junction */}
    <g transform="translate(260, 78)">
      <ellipse cx="20" cy="18" rx="22" ry="4" fill="#0C1512" opacity="0.7" />
      <rect x="0" y="0" width="40" height="15" rx="4" fill="#315B45" />
      <rect x="9" y="2" width="11" height="5" rx="1.5" fill="#D9EEE4" />
      <rect x="23" y="2" width="11" height="5" rx="1.5" fill="#D9EEE4" />
      <circle cx="10" cy="15" r="3.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
      <circle cx="30" cy="15" r="3.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
      <circle cx="40" cy="8" r="1.5" fill="#DF8220" />
      <text x="20" y="-8" fill="#7EAA93" fontSize="8.5" fontWeight="700" textAnchor="middle">DRIVER</text>
    </g>

    {/* Destination Hub (Right) */}
    <g transform="translate(470, 115)">
      <circle cx="0" cy="0" r="22" stroke="#7EAA93" strokeWidth="1" strokeDasharray="3 3" className="animate-waypoint-glow" />
      <circle cx="0" cy="0" r="14" fill="#192A20" stroke="#7EAA93" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="5" fill="#7EAA93" />
      <rect x="-26" y="-32" width="52" height="17" rx="8.5" fill="#192A20" stroke="#7EAA93" strokeWidth="1.2" />
      <text x="0" y="-20" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">CORRIDOR</text>
    </g>
  </svg>
);

/** D5: Stay in Control of Every Ride. — High-tech management console dials & route metrics */
export const DriverIllustration5 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Driver console management panel with ride status telemetry and vehicle metrics"
  >
    <defs>
      <radialGradient id="d5-ambient" cx="260" cy="120" r="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7EAA93" stopOpacity="0.14" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="520" height="240" rx="16" fill="url(#d5-ambient)" />

    {/* Central Telemetry Route Completion Gauge */}
    <g transform="translate(260, 120)">
      <circle cx="0" cy="0" r="68" stroke="#1D362B" strokeWidth="2" />
      <circle cx="0" cy="0" r="50" fill="#16231C" stroke="#315B45" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="34" stroke="#7EAA93" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* Dynamic needle */}
      <line x1="0" y1="0" x2="24" y2="-24" stroke="#FAF9F5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="0" r="6" fill="#7EAA93" />
      <text x="0" y="88" fill="#7EAA93" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.4">SYSTEM NOMINAL</text>
    </g>

    {/* Left Dial: Seat Occupancy Metric */}
    <g transform="translate(130, 120)">
      <circle cx="0" cy="0" r="38" fill="#162920" stroke="#7EAA93" strokeWidth="2" />
      <circle cx="0" cy="0" r="10" fill="#7EAA93" />
      <line x1="38" y1="0" x2="90" y2="0" stroke="#315B45" strokeWidth="2.5" strokeDasharray="4 4" />
      <text x="0" y="-8" fill="#FAF9F5" fontSize="13" fontWeight="800" textAnchor="middle">3/4</text>
      <text x="0" y="24" fill="#7EAA93" fontSize="8" fontWeight="700" textAnchor="middle">SEATS</text>
    </g>

    {/* Right Dial: Schedule / On-Time Telemetry */}
    <g transform="translate(390, 120)">
      <circle cx="0" cy="0" r="38" fill="#162920" stroke="#DF8220" strokeWidth="2" />
      <circle cx="0" cy="0" r="10" fill="#DF8220" />
      <line x1="-38" y1="0" x2="-90" y2="0" stroke="#DF8220" strokeWidth="2.5" strokeDasharray="4 4" />
      <text x="0" y="-8" fill="#FAF9F5" fontSize="13" fontWeight="800" textAnchor="middle">100%</text>
      <text x="0" y="24" fill="#DF8220" fontSize="8" fontWeight="700" textAnchor="middle">ON TIME</text>
    </g>
  </svg>
);

/** D6: Drive Together. Go Further. — Dramatic open highway perspective leading toward a glowing sunrise */
export const DriverIllustration6 = () => (
  <svg
    viewBox="0 0 520 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[200px] sm:h-[230px] lg:h-[250px] select-none"
    role="img"
    aria-label="Scenic highway perspective leading commuters toward an illuminated horizon"
  >
    <defs>
      <radialGradient id="d6-sunrise" cx="260" cy="95" r="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DF8220" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#DF8220" stopOpacity="0.25" />
        <stop offset="1" stopColor="#192A20" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="d6-highway-bed" x1="260" y1="105" x2="260" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#122019" />
        <stop offset="1" stopColor="#1C3528" />
      </linearGradient>
    </defs>

    {/* Horizon line & rolling emerald mountains */}
    <path d="M 30 110 Q 140 85, 260 102 T 490 95 V 220 H 30 Z" fill="#14241C" opacity="0.75" />

    {/* Radiant Sunrise Beacon on Horizon */}
    <circle cx="260" cy="95" r="75" fill="url(#d6-sunrise)" />
    <circle cx="260" cy="95" r="24" fill="#DF8220" />
    <circle cx="260" cy="95" r="40" stroke="#DF8220" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

    {/* Perspective Highway expanding forward */}
    <polygon points="260,105 110,225 410,225" fill="url(#d6-highway-bed)" />
    <line x1="260" y1="105" x2="110" y2="225" stroke="#315B45" strokeWidth="3.5" />
    <line x1="260" y1="105" x2="410" y2="225" stroke="#315B45" strokeWidth="3.5" />

    {/* Center dashed CarPool Lane divider */}
    <line
      x1="260"
      y1="105"
      x2="260"
      y2="225"
      stroke="#FAF9F5"
      strokeWidth="2.5"
      strokeDasharray="8 8"
      className="animate-dash-flow"
    />

    {/* Commuter Convergence Waves */}
    <ellipse cx="260" cy="180" rx="75" ry="16" stroke="#7EAA93" strokeWidth="1.8" strokeDasharray="5 5" opacity="0.8" />
    <ellipse cx="260" cy="150" rx="45" ry="10" stroke="#DF8220" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

    {/* Vehicle in motion along the CarPool lane */}
    <g transform="translate(242, 160)">
      <rect x="0" y="0" width="36" height="15" rx="4" fill="#315B45" />
      <rect x="8" y="2" width="10" height="5" rx="1.5" fill="#D9EEE4" />
      <rect x="20" y="2" width="10" height="5" rx="1.5" fill="#D9EEE4" />
      <circle cx="9" cy="15" r="3" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
      <circle cx="27" cy="15" r="3" fill="#192A20" stroke="#7EAA93" strokeWidth="1.5" />
    </g>
  </svg>
);
