import {
  PassengerIllustration1,
  PassengerIllustration2,
  PassengerIllustration3,
  PassengerIllustration4,
  PassengerIllustration5,
  PassengerIllustration6,
  DriverIllustration1,
  DriverIllustration2,
  DriverIllustration3,
  DriverIllustration4,
  DriverIllustration5,
  DriverIllustration6
} from '../components/auth/AuthPromoIllustrations.jsx';

/* ─────────────────────────────────────────────────────────────
   PASSENGER VARIANTS (EXACT COPY — 6 VARIANTS)
   ───────────────────────────────────────────────────────────── */

export const PASSENGER_VARIANTS = [
  {
    id: 'passenger-1',
    eyebrow: 'RIDE SHARING PLATFORM',
    headline: 'Your Journey. Shared.',
    description: 'Connect with people heading your way. Share rides, split travel costs, and make everyday commuting easier.',
    benefits: [
      'Share travel costs with fellow commuters',
      'Find rides that match your route',
      'Plan your journey with available trip updates'
    ],
    Illustration: PassengerIllustration1,
    imageAlt: 'Visual illustration of passengers sharing rides along a connected corridor'
  },
  {
    id: 'passenger-2',
    eyebrow: 'INTELLIGENT ROUTING',
    headline: 'Better Routes. Smarter Rides.',
    description: 'Find rides that fit your route and schedule, without making your daily commute more complicated.',
    benefits: [
      'Explore available routes',
      'Compare matching ride options',
      'Choose a journey that suits your schedule'
    ],
    Illustration: PassengerIllustration2,
    imageAlt: 'Smart route comparison showing optimal matched travel options'
  },
  {
    id: 'passenger-3',
    eyebrow: 'COMMUNITY & FAIR PRICING',
    headline: 'Good Company. Shared Costs.',
    description: 'Turn an everyday journey into a shared experience while splitting eligible travel expenses.',
    benefits: [
      'Connect with fellow travellers',
      'Share eligible travel expenses',
      'Make everyday journeys more collaborative'
    ],
    Illustration: PassengerIllustration3,
    imageAlt: 'Travel expenses split fairly among co-riders illustration'
  },
  {
    id: 'passenger-4',
    eyebrow: 'FLEXIBLE SCHEDULING',
    headline: 'Your Schedule, Your Ride.',
    description: 'Explore scheduled carpools and plan your next journey around the time that works for you.',
    benefits: [
      'Browse scheduled carpools',
      'Review ride details before booking',
      'Manage your upcoming trips'
    ],
    Illustration: PassengerIllustration4,
    imageAlt: 'Scheduled carpools and upcoming trip planning calendar illustration'
  },
  {
    id: 'passenger-5',
    eyebrow: 'LIVE TRIP TELEMETRY',
    headline: 'Know Your Route. Enjoy the Ride.',
    description: 'Keep track of your journey with available trip updates and live tracking features.',
    benefits: [
      'Access available trip updates',
      'Follow your trip when tracking is enabled',
      'Stay informed about ride status'
    ],
    Illustration: PassengerIllustration5,
    imageAlt: 'Live navigation telemetry HUD showing ride tracking and updates'
  },
  {
    id: 'passenger-6',
    eyebrow: 'COLLABORATIVE COMMUTE',
    headline: 'Every Commute Connects Us.',
    description: 'Discover a more collaborative way to travel, one shared journey at a time.',
    benefits: [
      'Discover shared travel options',
      'Connect journeys with similar destinations',
      'Make better use of available seats'
    ],
    Illustration: PassengerIllustration6,
    imageAlt: 'Urban collaborative commute network connecting daily travellers'
  }
];

/* ─────────────────────────────────────────────────────────────
   DRIVER VARIANTS (EXACT COPY — 6 VARIANTS)
   ───────────────────────────────────────────────────────────── */

export const DRIVER_VARIANTS = [
  {
    id: 'driver-1',
    eyebrow: 'DRIVER OPERATIONS CONSOLE',
    headline: 'Your Route. Your Rules.',
    description: 'Share your journey with passengers heading in the same direction and make better use of your available seats.',
    benefits: [
      'Offer available seats on your journey',
      'Manage your ride availability',
      'Connect with passengers along your route'
    ],
    Illustration: DriverIllustration1,
    imageAlt: 'Driver cockpit route console and seat availability controls'
  },
  {
    id: 'driver-2',
    eyebrow: 'SEAT UTILIZATION',
    headline: 'Empty Seats. Shared Journeys.',
    description: 'Turn spare seats into opportunities to connect with fellow commuters along your route.',
    benefits: [
      'Publish your available seats',
      'Coordinate shared journeys',
      'Make better use of your existing commute'
    ],
    Illustration: DriverIllustration2,
    imageAlt: 'Vehicle interior seat map turning empty seats into shared carpools'
  },
  {
    id: 'driver-3',
    eyebrow: 'ADVANCE DISPATCH',
    headline: 'Plan Ahead. Drive Smarter.',
    description: 'Publish scheduled carpools, set your departure details, and manage your ride availability.',
    benefits: [
      'Create scheduled rides',
      'Set route and departure details',
      'Manage bookings through your driver portal'
    ],
    Illustration: DriverIllustration3,
    imageAlt: 'Driver route publishing console and departure schedule controls'
  },
  {
    id: 'driver-4',
    eyebrow: 'COMMUTER CORRIDORS',
    headline: 'Your Route Has Room for More.',
    description: 'Connect with passengers whose journeys align with yours and coordinate trips more efficiently.',
    benefits: [
      'Review relevant ride requests',
      'Coordinate matching journeys',
      'Share available seats along your route'
    ],
    Illustration: DriverIllustration4,
    imageAlt: 'Commuter corridor radar matching passenger pickup requests'
  },
  {
    id: 'driver-5',
    eyebrow: 'CONSOLE MANAGEMENT',
    headline: 'Stay in Control of Every Ride.',
    description: 'Manage your routes, seat availability, and ride requests from your CarPool driver portal.',
    benefits: [
      'Manage your published rides',
      'Review ride and booking status',
      'Access available trip-management tools'
    ],
    Illustration: DriverIllustration5,
    imageAlt: 'Driver portal management panel with ride requests and tools'
  },
  {
    id: 'driver-6',
    eyebrow: 'COLLABORATIVE TRANSIT',
    headline: 'Drive Together. Go Further.',
    description: 'Make everyday travel more collaborative by bringing people with similar destinations together.',
    benefits: [
      'Connect with fellow commuters',
      'Share your journey with others',
      'Make everyday travel more collaborative'
    ],
    Illustration: DriverIllustration6,
    imageAlt: 'Scenic highway bringing commuters together on shared journeys'
  }
];

/**
 * Stable, refresh-based content rotation helper.
 * Selects a variant on full page refresh and avoids consecutive repeats using sessionStorage.
 * Completely stable during the current React session.
 */
export const getRotatingVariant = (role) => {
  const list = role === 'driver' ? DRIVER_VARIANTS : PASSENGER_VARIANTS;
  const storageKey = `carpool_promo_${role}_variant_index`;

  try {
    let lastIndex = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = window.sessionStorage.getItem(storageKey);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < list.length) {
          lastIndex = parsed;
        }
      }
    }

    let nextIndex;
    if (lastIndex === null) {
      nextIndex = Math.floor(Math.random() * list.length);
    } else {
      const candidates = [];
      for (let i = 0; i < list.length; i++) {
        if (i !== lastIndex) candidates.push(i);
      }
      nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    }

    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(storageKey, nextIndex.toString());
    }

    return list[nextIndex] || list[0];
  } catch {
    return list[0];
  }
};
