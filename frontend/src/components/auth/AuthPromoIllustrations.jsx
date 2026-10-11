/* ─────────────────────────────────────────────────────────────
   PASSENGER ILLUSTRATIONS (Curated, high-fidelity SVGs)
   ───────────────────────────────────────────────────────────── */

export const PassengerIllustration1 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Corridor route connecting commuters along a shared carpool"
  >
    <defs>
      <linearGradient id="p1-road" x1="20" y1="110" x2="420" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#087F5B" stopOpacity="0.2" />
        <stop offset="0.5" stopColor="#087F5B" stopOpacity="0.8" />
        <stop offset="1" stopColor="#12B886" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="p1-glow" x1="180" y1="60" x2="260" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#12B886" stopOpacity="0.25" />
        <stop offset="1" stopColor="#087F5B" stopOpacity="0.02" />
      </linearGradient>
    </defs>
    {/* Grid backdrop */}
    <g opacity="0.15" stroke="#4E7A68" strokeWidth="0.75" strokeDasharray="3 3">
      <line x1="30" y1="30" x2="410" y2="30" />
      <line x1="30" y1="80" x2="410" y2="80" />
      <line x1="30" y1="130" x2="410" y2="130" />
      <line x1="30" y1="180" x2="410" y2="180" />
      <line x1="80" y1="20" x2="80" y2="200" />
      <line x1="220" y1="20" x2="220" y2="200" />
      <line x1="360" y1="20" x2="360" y2="200" />
    </g>

    {/* Route curve */}
    <path
      d="M 40 145 C 120 160, 150 70, 230 85 C 310 100, 340 160, 400 120"
      stroke="url(#p1-road)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M 40 145 C 120 160, 150 70, 230 85 C 310 100, 340 160, 400 120"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="6 6"
      opacity="0.8"
    />

    {/* Origin stop card */}
    <g transform="translate(30, 95)">
      <rect width="70" height="34" rx="6" fill="#1E2F28" stroke="#324B3F" strokeWidth="1" />
      <circle cx="16" cy="17" r="5" fill="#E8A45B" />
      <text x="27" y="15" fill="#FAF9F5" fontSize="9" fontWeight="600" fontFamily="sans-serif">Origin</text>
      <text x="27" y="25" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Pickup</text>
    </g>

    {/* Central Car Badge */}
    <g transform="translate(195, 55)">
      <rect width="70" height="58" rx="10" fill="#162921" stroke="#087F5B" strokeWidth="1.5" />
      <rect width="70" height="58" rx="10" fill="url(#p1-glow)" />
      <circle cx="35" cy="24" r="14" fill="#087F5B" />
      <path d="M28 26 L30 20 C30.5 19 32 18.5 35 18.5 C38 18.5 39.5 19 40 20 L42 26" stroke="#FAF9F5" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="27" y="24" width="16" height="7" rx="1.5" fill="#FAF9F5" />
      <circle cx="30" cy="31" r="2" fill="#18241F" />
      <circle cx="40" cy="31" r="2" fill="#18241F" />
      <text x="35" y="47" textAnchor="middle" fill="#12B886" fontSize="9" fontWeight="700" fontFamily="sans-serif">Shared Ride</text>
    </g>

    {/* Commuter Waypoint 1 */}
    <g transform="translate(130, 130)">
      <circle cx="18" cy="18" r="14" fill="#1E2F28" stroke="#087F5B" strokeWidth="1" />
      <circle cx="18" cy="14" r="4" fill="#E8A45B" />
      <path d="M12 24 C12 21, 15 20, 18 20 C21 20, 24 21, 24 24" fill="#E8A45B" />
      <rect x="36" y="8" width="76" height="22" rx="4" fill="#1E2F28" stroke="#324B3F" />
      <text x="42" y="22" fill="#FAF9F5" fontSize="8.5" fontFamily="sans-serif">Commuter +1</text>
    </g>

    {/* Destination stop card */}
    <g transform="translate(330, 95)">
      <rect width="80" height="34" rx="6" fill="#1E2F28" stroke="#324B3F" strokeWidth="1" />
      <circle cx="16" cy="17" r="5" fill="#12B886" />
      <text x="27" y="15" fill="#FAF9F5" fontSize="9" fontWeight="600" fontFamily="sans-serif">Drop-off</text>
      <text x="27" y="25" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Direct Corridor</text>
    </g>
  </svg>
);

export const PassengerIllustration2 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Smart route comparison showing optimal matched travel path"
  >
    {/* Map grid background */}
    <rect x="20" y="20" width="400" height="180" rx="12" fill="#162921" stroke="#2A4237" strokeWidth="1" />
    
    {/* Secondary alternate route */}
    <path
      d="M 60 150 Q 140 180, 220 150 T 380 70"
      stroke="#3A5247"
      strokeWidth="4"
      strokeDasharray="4 4"
      fill="none"
    />
    <g transform="translate(250, 155)">
      <rect width="70" height="20" rx="4" fill="#20332B" stroke="#3A5247" />
      <text x="8" y="14" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Route B · 42 min</text>
    </g>

    {/* Optimal Carpool Route */}
    <path
      d="M 60 150 C 130 90, 180 60, 240 85 C 300 110, 330 90, 380 70"
      stroke="#087F5B"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 60 150 C 130 90, 180 60, 240 85 C 300 110, 330 90, 380 70"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="5 5"
      fill="none"
    />

    {/* Optimal badge */}
    <g transform="translate(150, 40)">
      <rect width="130" height="38" rx="8" fill="#1E332A" stroke="#12B886" strokeWidth="1.5" />
      <circle cx="20" cy="19" r="8" fill="#087F5B" />
      <path d="M16 19 L19 22 L24 16" stroke="#FAF9F5" strokeWidth="1.5" strokeLinecap="round" />
      <text x="34" y="17" fill="#FAF9F5" fontSize="10" fontWeight="700" fontFamily="sans-serif">Optimal Route</text>
      <text x="34" y="29" fill="#12B886" fontSize="8.5" fontFamily="sans-serif">28 min · 0 detours</text>
    </g>

    {/* Pin Start */}
    <circle cx="60" cy="150" r="9" fill="#E8A45B" stroke="#FAF9F5" strokeWidth="2" />
    <circle cx="60" cy="150" r="3" fill="#18241F" />

    {/* Pin End */}
    <circle cx="380" cy="70" r="9" fill="#12B886" stroke="#FAF9F5" strokeWidth="2" />
    <circle cx="380" cy="70" r="3" fill="#18241F" />
  </svg>
);

export const PassengerIllustration3 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Shared trip expenses split fairly among co-riders"
  >
    {/* Card Container */}
    <rect x="30" y="25" width="380" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />
    
    {/* Header banner */}
    <rect x="30" y="25" width="380" height="42" rx="12" fill="#1E332A" />
    <text x="52" y="51" fill="#FAF9F5" fontSize="12" fontWeight="700" fontFamily="sans-serif">Trip Fare Split Breakdown</text>
    <rect x="310" y="36" width="85" height="20" rx="10" fill="#087F5B" />
    <text x="322" y="50" fill="#FAF9F5" fontSize="9" fontWeight="600" fontFamily="sans-serif">3 Commuters</text>

    {/* 3 Passenger cost breakdown columns */}
    {/* Rider 1 */}
    <g transform="translate(50, 85)">
      <rect width="98" height="90" rx="8" fill="#1B2D25" stroke="#324B3F" strokeWidth="1" />
      <circle cx="49" cy="26" r="14" fill="#087F5B" />
      <text x="49" y="30" textAnchor="middle" fill="#FAF9F5" fontSize="10" fontWeight="bold" fontFamily="sans-serif">You</text>
      <text x="49" y="56" textAnchor="middle" fill="#FAF9F5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">₹140</text>
      <text x="49" y="70" textAnchor="middle" fill="#12B886" fontSize="8" fontFamily="sans-serif">1/3 Shared</text>
    </g>

    {/* Rider 2 */}
    <g transform="translate(170, 85)">
      <rect width="98" height="90" rx="8" fill="#1B2D25" stroke="#324B3F" strokeWidth="1" />
      <circle cx="49" cy="26" r="14" fill="#253E33" />
      <circle cx="49" cy="23" r="5" fill="#E8A45B" />
      <path d="M41 33 C41 29, 45 28, 49 28 C53 28, 57 29, 57 33" fill="#E8A45B" />
      <text x="49" y="56" textAnchor="middle" fill="#FAF9F5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">₹140</text>
      <text x="49" y="70" textAnchor="middle" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Co-Traveller</text>
    </g>

    {/* Rider 3 */}
    <g transform="translate(290, 85)">
      <rect width="98" height="90" rx="8" fill="#1B2D25" stroke="#324B3F" strokeWidth="1" />
      <circle cx="49" cy="26" r="14" fill="#253E33" />
      <circle cx="49" cy="23" r="5" fill="#12B886" />
      <path d="M41 33 C41 29, 45 28, 49 28 C53 28, 57 29, 57 33" fill="#12B886" />
      <text x="49" y="56" textAnchor="middle" fill="#FAF9F5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">₹140</text>
      <text x="49" y="70" textAnchor="middle" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Co-Traveller</text>
    </g>
  </svg>
);

export const PassengerIllustration4 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Scheduled carpools timeline and booking calendar"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />
    
    {/* Schedule dial card */}
    <g transform="translate(45, 45)">
      <rect width="160" height="130" rx="10" fill="#1B2F26" stroke="#087F5B" strokeWidth="1.5" />
      <circle cx="36" cy="36" r="18" fill="#087F5B" />
      <path d="M36 26 V36 H44" stroke="#FAF9F5" strokeWidth="2" strokeLinecap="round" />
      <text x="64" y="32" fill="#FAF9F5" fontSize="12" fontWeight="700" fontFamily="sans-serif">08:30 AM</text>
      <text x="64" y="46" fill="#12B886" fontSize="9" fontFamily="sans-serif">Tomorrow Morning</text>
      
      <line x1="20" y1="65" x2="140" y2="65" stroke="#2A4237" strokeWidth="1" />
      
      <text x="20" y="85" fill="#8A9A92" fontSize="8.5" fontFamily="sans-serif">Route</text>
      <text x="20" y="100" fill="#FAF9F5" fontSize="10" fontWeight="600" fontFamily="sans-serif">Indiranagar → Tech Park</text>
      <rect x="20" y="108" width="75" height="14" rx="3" fill="#E8A45B" fillOpacity="0.2" />
      <text x="26" y="118" fill="#E8A45B" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Confirmed Seat</text>
    </g>

    {/* Timeline milestones */}
    <g transform="translate(230, 48)">
      <line x1="16" y1="20" x2="16" y2="105" stroke="#087F5B" strokeWidth="2" strokeDasharray="3 3" />
      
      <circle cx="16" cy="20" r="8" fill="#087F5B" />
      <text x="32" y="18" fill="#FAF9F5" fontSize="10" fontWeight="600" fontFamily="sans-serif">Scheduled Booking</text>
      <text x="32" y="28" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Selected time slot confirmed</text>

      <circle cx="16" cy="65" r="8" fill="#E8A45B" />
      <text x="32" y="63" fill="#FAF9F5" fontSize="10" fontWeight="600" fontFamily="sans-serif">Driver Pickup Notification</text>
      <text x="32" y="73" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">15 min departure alert</text>

      <circle cx="16" cy="110" r="8" fill="#12B886" />
      <text x="32" y="108" fill="#FAF9F5" fontSize="10" fontWeight="600" fontFamily="sans-serif">Seamless Journey</text>
      <text x="32" y="118" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Arrival on schedule</text>
    </g>
  </svg>
);

export const PassengerIllustration5 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Live GPS route telemetry and real-time trip tracking"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />
    
    {/* Radar sweep / Compass */}
    <g transform="translate(90, 110)">
      <circle cx="0" cy="0" r="55" stroke="#253D32" strokeWidth="1" fill="none" />
      <circle cx="0" cy="0" r="36" stroke="#087F5B" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      <circle cx="0" cy="0" r="16" fill="#087F5B" fillOpacity="0.3" />
      <circle cx="0" cy="0" r="6" fill="#12B886" />
      
      {/* Pulse ring */}
      <circle cx="0" cy="0" r="26" stroke="#12B886" strokeWidth="1.5" opacity="0.6" />
      
      {/* Target marker */}
      <circle cx="20" cy="-22" r="4" fill="#E8A45B" />
      <text x="26" y="-20" fill="#FAF9F5" fontSize="8" fontFamily="sans-serif">En Route</text>
    </g>

    {/* Live Status Telemetry Panel */}
    <g transform="translate(185, 45)">
      <rect width="210" height="130" rx="10" fill="#1B2F26" stroke="#324B3F" strokeWidth="1" />
      
      <rect x="16" y="14" width="70" height="18" rx="9" fill="#087F5B" />
      <circle cx="25" cy="23" r="3.5" fill="#FAF9F5" />
      <text x="34" y="26" fill="#FAF9F5" fontSize="8" fontWeight="bold" fontFamily="sans-serif">LIVE GPS</text>
      
      <text x="16" y="55" fill="#FAF9F5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">5.4 km · 12 mins away</text>
      
      {/* Progress Bar */}
      <rect x="16" y="68" width="178" height="6" rx="3" fill="#253D32" />
      <rect x="16" y="68" width="120" height="6" rx="3" fill="#12B886" />
      
      <text x="16" y="94" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Next Stop: Sector 4 Hub</text>
      <text x="16" y="108" fill="#12B886" fontSize="8" fontWeight="600" fontFamily="sans-serif">Trip status: On schedule</text>
    </g>
  </svg>
);

export const PassengerIllustration6 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Urban collaborative commute network connecting daily travellers"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Interconnected transit network */}
    <g opacity="0.8">
      <line x1="90" y1="80" x2="190" y2="120" stroke="#087F5B" strokeWidth="2" />
      <line x1="190" y1="120" x2="310" y2="70" stroke="#12B886" strokeWidth="2.5" />
      <line x1="190" y1="120" x2="250" y2="160" stroke="#E8A45B" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="310" y1="70" x2="370" y2="140" stroke="#087F5B" strokeWidth="2" />
    </g>

    {/* Network Node 1 */}
    <g transform="translate(90, 80)">
      <circle cx="0" cy="0" r="16" fill="#1E332A" stroke="#087F5B" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#087F5B" />
      <text x="0" y="26" textAnchor="middle" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">North Hub</text>
    </g>

    {/* Central CarPool Interchange */}
    <g transform="translate(190, 120)">
      <circle cx="0" cy="0" r="26" fill="#1E332A" stroke="#12B886" strokeWidth="2" />
      <circle cx="0" cy="0" r="16" fill="#087F5B" />
      <path d="M-6 0 H6 M0 -6 V6" stroke="#FAF9F5" strokeWidth="2" />
      <text x="0" y="38" textAnchor="middle" fill="#FAF9F5" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">Community Corridor</text>
    </g>

    {/* Network Node 3 */}
    <g transform="translate(310, 70)">
      <circle cx="0" cy="0" r="18" fill="#1E332A" stroke="#E8A45B" strokeWidth="2" />
      <circle cx="0" cy="0" r="7" fill="#E8A45B" />
      <text x="0" y="28" textAnchor="middle" fill="#FAF9F5" fontSize="8" fontFamily="sans-serif">Metro Station</text>
    </g>

    {/* Network Node 4 */}
    <g transform="translate(370, 140)">
      <circle cx="0" cy="0" r="14" fill="#1E332A" stroke="#087F5B" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="5" fill="#12B886" />
      <text x="0" y="24" textAnchor="middle" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">Cyber City</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   DRIVER ILLUSTRATIONS (Curated, high-fidelity SVGs)
   ───────────────────────────────────────────────────────────── */

export const DriverIllustration1 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Driver cockpit route console and seat availability controls"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Route Availability Toggle Console */}
    <g transform="translate(50, 48)">
      <rect width="180" height="124" rx="8" fill="#1B2F26" stroke="#087F5B" strokeWidth="1.5" />
      
      {/* Route Status Header */}
      <text x="16" y="24" fill="#8A9A92" fontSize="8.5" fontFamily="sans-serif">DRIVER ROUTE STATUS</text>
      <text x="16" y="44" fill="#FAF9F5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Daily Commute Active</text>
      
      {/* Toggle Pill */}
      <rect x="16" y="58" width="56" height="22" rx="11" fill="#087F5B" />
      <circle cx="59" cy="69" r="8" fill="#FAF9F5" />
      <text x="24" y="72" fill="#FAF9F5" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ON</text>

      <line x1="16" y1="92" x2="164" y2="92" stroke="#253D32" strokeWidth="1" />
      <text x="16" y="108" fill="#12B886" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">3 Seats Available · Auto-Accept</text>
    </g>

    {/* Route Metrics Pill Group */}
    <g transform="translate(250, 48)">
      <rect width="145" height="56" rx="8" fill="#1B2F26" stroke="#324B3F" strokeWidth="1" />
      <text x="16" y="22" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">YOUR PREFERRED ROUTE</text>
      <text x="16" y="38" fill="#FAF9F5" fontSize="11" fontWeight="600" fontFamily="sans-serif">Direct Outer Ring Rd</text>
      <text x="16" y="48" fill="#E8A45B" fontSize="8" fontFamily="sans-serif">Zero unapproved detours</text>
      
      <rect y="68" width="145" height="56" rx="8" fill="#1B2F26" stroke="#324B3F" strokeWidth="1" />
      <text x="16" y="90" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">ESTIMATED OFFSET</text>
      <text x="16" y="106" fill="#12B886" fontSize="13" fontWeight="bold" fontFamily="sans-serif">₹350 · 3 Co-Riders</text>
      <text x="16" y="117" fill="#FAF9F5" fontSize="8" fontFamily="sans-serif">Travel expense sharing</text>
    </g>
  </svg>
);

export const DriverIllustration2 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Vehicle seat map schematic turning empty seats into shared carpools"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Car cabin outline */}
    <g transform="translate(60, 42)">
      <rect width="130" height="136" rx="20" fill="#1B2F26" stroke="#324B3F" strokeWidth="1.5" />
      <rect x="18" y="10" width="94" height="22" rx="4" fill="#253D32" />
      <text x="65" y="24" textAnchor="middle" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">Windshield</text>

      {/* Front row */}
      {/* Driver seat */}
      <rect x="22" y="42" width="38" height="34" rx="6" fill="#087F5B" />
      <text x="41" y="62" textAnchor="middle" fill="#FAF9F5" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">Driver</text>
      
      {/* Front passenger seat */}
      <rect x="70" y="42" width="38" height="34" rx="6" fill="#1E3A2F" stroke="#12B886" strokeWidth="1" />
      <circle cx="89" cy="54" r="5" fill="#12B886" />
      <text x="89" y="68" textAnchor="middle" fill="#FAF9F5" fontSize="7" fontFamily="sans-serif">Booked</text>

      {/* Rear row */}
      <rect x="22" y="86" width="38" height="34" rx="6" fill="#1E3A2F" stroke="#12B886" strokeWidth="1" />
      <circle cx="41" cy="98" r="5" fill="#12B886" />
      <text x="41" y="112" textAnchor="middle" fill="#FAF9F5" fontSize="7" fontFamily="sans-serif">Booked</text>

      <rect x="70" y="86" width="38" height="34" rx="6" fill="#20362C" stroke="#E8A45B" strokeWidth="1" strokeDasharray="2 2" />
      <text x="89" y="104" textAnchor="middle" fill="#E8A45B" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Open</text>
    </g>

    {/* Seat Status Legend */}
    <g transform="translate(220, 52)">
      <text x="0" y="18" fill="#FAF9F5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Seat Capacity Manager</text>
      <text x="0" y="32" fill="#8A9A92" fontSize="8.5" fontFamily="sans-serif">Fill empty seats without going out of your way</text>

      <g transform="translate(0, 48)">
        <rect width="170" height="28" rx="6" fill="#1B2F26" stroke="#324B3F" />
        <circle cx="16" cy="14" r="5" fill="#12B886" />
        <text x="28" y="17" fill="#FAF9F5" fontSize="8.5" fontFamily="sans-serif">2 Verified Passengers matched</text>
      </g>

      <g transform="translate(0, 84)">
        <rect width="170" height="28" rx="6" fill="#1B2F26" stroke="#324B3F" />
        <circle cx="16" cy="14" r="5" fill="#E8A45B" />
        <text x="28" y="17" fill="#FAF9F5" fontSize="8.5" fontFamily="sans-serif">1 Spare Seat ready to publish</text>
      </g>
    </g>
  </svg>
);

export const DriverIllustration3 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Driver route publishing calendar and scheduled departure controls"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Scheduled Ride Publishing Form Card */}
    <g transform="translate(45, 45)">
      <rect width="200" height="130" rx="8" fill="#1B2F26" stroke="#087F5B" strokeWidth="1.5" />
      <rect x="14" y="14" width="85" height="18" rx="4" fill="#087F5B" />
      <text x="22" y="26" fill="#FAF9F5" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PUBLISH RIDE</text>
      
      <text x="14" y="48" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">DEPARTURE TIME</text>
      <text x="14" y="62" fill="#FAF9F5" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Mon - Fri · 08:45 AM</text>

      <line x1="14" y1="74" x2="186" y2="74" stroke="#253D32" strokeWidth="1" />

      <text x="14" y="90" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">ORIGIN &amp; DESTINATION</text>
      <text x="14" y="104" fill="#FAF9F5" fontSize="9.5" fontWeight="600" fontFamily="sans-serif">Koramangala ➔ Whitefield</text>
      <text x="14" y="117" fill="#12B886" fontSize="8" fontFamily="sans-serif">Repeating weekly carpool</text>
    </g>

    {/* Calendar / Schedule dials */}
    <g transform="translate(265, 48)">
      <rect width="130" height="124" rx="8" fill="#1B2F26" stroke="#324B3F" strokeWidth="1" />
      <text x="14" y="24" fill="#8A9A92" fontSize="8" fontFamily="sans-serif">WEEKDAY COMMUTE</text>
      
      <g transform="translate(14, 36)">
        {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
          <g key={i} transform={`translate(${i * 21}, 0)`}>
            <circle cx="9" cy="9" r="8.5" fill={i < 4 ? '#087F5B' : '#E8A45B'} />
            <text x="9" y="12" textAnchor="middle" fill="#FAF9F5" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">{day}</text>
          </g>
        ))}
      </g>

      <rect x="14" y="72" width="102" height="24" rx="4" fill="#087F5B" />
      <text x="65" y="87" textAnchor="middle" fill="#FAF9F5" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">Active Schedule</text>

      <text x="14" y="112" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">Auto-opens seat bookings</text>
    </g>
  </svg>
);

export const DriverIllustration4 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Route alignment radar matching passenger pickup requests"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Driver Route Path */}
    <path
      d="M 50 140 C 120 150, 180 80, 270 90 C 330 100, 360 140, 390 120"
      stroke="#087F5B"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 50 140 C 120 150, 180 80, 270 90 C 330 100, 360 140, 390 120"
      stroke="#FAF9F5"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      fill="none"
    />

    {/* Passenger pickup request node 1 */}
    <g transform="translate(130, 75)">
      <circle cx="20" cy="20" r="16" fill="#1B2F26" stroke="#12B886" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" fill="#12B886" />
      <rect x="42" y="8" width="95" height="24" rx="4" fill="#1B2F26" stroke="#324B3F" />
      <text x="48" y="20" fill="#FAF9F5" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Matched Passenger</text>
      <text x="48" y="28" fill="#12B886" fontSize="7" fontFamily="sans-serif">+0.2 km pickup offset</text>
    </g>

    {/* Passenger pickup request node 2 */}
    <g transform="translate(240, 120)">
      <circle cx="20" cy="20" r="16" fill="#1B2F26" stroke="#E8A45B" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" fill="#E8A45B" />
      <rect x="42" y="8" width="105" height="24" rx="4" fill="#1B2F26" stroke="#324B3F" />
      <text x="48" y="20" fill="#FAF9F5" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Matching Drop-off</text>
      <text x="48" y="28" fill="#8A9A92" fontSize="7" fontFamily="sans-serif">On direct corridor</text>
    </g>

    {/* Driver Icon */}
    <g transform="translate(45, 120)">
      <circle cx="16" cy="16" r="14" fill="#087F5B" stroke="#FAF9F5" strokeWidth="2" />
      <text x="16" y="20" textAnchor="middle" fill="#FAF9F5" fontSize="10" fontWeight="bold" fontFamily="sans-serif">YOU</text>
    </g>
  </svg>
);

export const DriverIllustration5 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Driver operations portal with live booking requests and ride management"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Driver Portal Dashboard Card */}
    <g transform="translate(45, 42)">
      <rect width="350" height="136" rx="10" fill="#1B2F26" stroke="#324B3F" strokeWidth="1" />
      
      {/* Top status bar */}
      <rect width="350" height="34" rx="10" fill="#1F362C" />
      <text x="18" y="22" fill="#FAF9F5" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Driver Operations Portal</text>
      <rect x="250" y="8" width="85" height="18" rx="9" fill="#087F5B" />
      <text x="262" y="20" fill="#FAF9F5" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">CONSOLE READY</text>

      {/* Booking Row 1 */}
      <g transform="translate(18, 48)">
        <rect width="314" height="32" rx="6" fill="#162921" stroke="#2A4237" strokeWidth="1" />
        <circle cx="18" cy="16" r="8" fill="#087F5B" />
        <text x="32" y="16" fill="#FAF9F5" fontSize="9" fontWeight="600" fontFamily="sans-serif">Rohan S. · 1 Seat</text>
        <text x="32" y="24" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">Pickup at Metro Gate 2</text>
        <rect x="234" y="8" width="68" height="16" rx="4" fill="#12B886" fillOpacity="0.2" />
        <text x="246" y="19" fill="#12B886" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">CONFIRMED</text>
      </g>

      {/* Booking Row 2 */}
      <g transform="translate(18, 88)">
        <rect width="314" height="32" rx="6" fill="#162921" stroke="#2A4237" strokeWidth="1" />
        <circle cx="18" cy="16" r="8" fill="#E8A45B" />
        <text x="32" y="16" fill="#FAF9F5" fontSize="9" fontWeight="600" fontFamily="sans-serif">Ananya M. · 1 Seat</text>
        <text x="32" y="24" fill="#8A9A92" fontSize="7.5" fontFamily="sans-serif">Direct Drop-off at Tech Park</text>
        <rect x="234" y="8" width="68" height="16" rx="4" fill="#E8A45B" fillOpacity="0.2" />
        <text x="246" y="19" fill="#E8A45B" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">CONFIRMED</text>
      </g>
    </g>
  </svg>
);

export const DriverIllustration6 = () => (
  <svg
    viewBox="0 0 440 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-h-[220px] select-none"
    role="img"
    aria-label="Scenic collaborative highway bringing commuters together on shared journeys"
  >
    <rect x="25" y="25" width="390" height="170" rx="12" fill="#162921" stroke="#2B4337" strokeWidth="1" />

    {/* Horizon line & subtle mountains */}
    <path d="M25 110 Q 120 90, 220 105 T 415 100 V 195 H 25 Z" fill="#1B2F26" opacity="0.6" />
    
    {/* Highway perspective expanding outward */}
    <path d="M 220 100 L 110 195 H 330 L 220 100 Z" fill="#13241D" />
    <path d="M 220 100 L 220 195" stroke="#FAF9F5" strokeWidth="2" strokeDasharray="6 6" />
    <line x1="220" y1="100" x2="110" y2="195" stroke="#087F5B" strokeWidth="3" />
    <line x1="220" y1="100" x2="330" y2="195" stroke="#087F5B" strokeWidth="3" />

    {/* Sun / Destination Beacon */}
    <circle cx="220" cy="85" r="18" fill="#E8A45B" fillOpacity="0.8" />
    <circle cx="220" cy="85" r="28" stroke="#E8A45B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

    {/* Commuters banner floating over road */}
    <g transform="translate(130, 140)">
      <rect width="180" height="34" rx="6" fill="#1A3026" stroke="#12B886" strokeWidth="1.5" />
      <circle cx="20" cy="17" r="8" fill="#087F5B" />
      <path d="M16 17 L19 20 L24 14" stroke="#FAF9F5" strokeWidth="1.5" />
      <text x="34" y="16" fill="#FAF9F5" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Shared Commute Network</text>
      <text x="34" y="26" fill="#12B886" fontSize="7.5" fontFamily="sans-serif">Connecting destinations seamlessly</text>
    </g>
  </svg>
);
