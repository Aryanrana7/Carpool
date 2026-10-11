/**
 * CarPool Comprehensive FAQ & Help Dataset
 * Reflects genuine application behavior and business rules.
 */

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'booking', label: 'Booking & Reservations' },
  { id: 'rides', label: 'Finding & Offering Rides' },
  { id: 'cancellations', label: 'Ride Cancellations' },
  { id: 'accounts', label: 'Accounts & Roles' },
  { id: 'payments', label: 'Pricing & Payments' },
  { id: 'tracking', label: 'Live Tracking & Status' },
  { id: 'problems', label: 'Reporting Problems' },
  { id: 'safety', label: 'Safety & Emergency' },
];

export const FAQ_ITEMS = [
  // Booking & Reservations
  {
    id: 'book-1',
    category: 'booking',
    question: 'How do I book a seat on a scheduled carpool?',
    answer:
      'Search for your origin and destination from the homepage booking console. Choose your desired departure date and time, review available matching rides with driver details and ratings, and click "Select Ride". Confirm your seat count to reserve your spot.',
  },
  {
    id: 'book-2',
    category: 'booking',
    question: 'What is the difference between Scheduled Carpools and Instant On-Demand?',
    answer:
      'Scheduled Carpools let you plan ahead for intercity or daily commutes by reserving seats in a driver\'s pre-published trip. Instant On-Demand allows you to request an immediate pickup where nearby verified drivers are notified and matched in real time.',
  },
  {
    id: 'book-3',
    category: 'booking',
    question: 'Can I book multiple seats for family or colleagues?',
    answer:
      'Yes. When booking, select the number of seats you require. The booking form ensures the vehicle has sufficient available seats before reservation and updates the remaining capacity atomically.',
  },

  // Finding & Offering Rides
  {
    id: 'ride-1',
    category: 'rides',
    question: 'How do drivers publish a scheduled ride?',
    answer:
      'Registered drivers can navigate to the Driver Operations Console and click "Publish a Scheduled Route" (or Offer a Ride). Specify your origin, destination, departure time, seat count, vehicle details, and per-seat fare. Once published, your ride becomes searchable by passengers traveling along your corridor.',
  },
  {
    id: 'ride-2',
    category: 'rides',
    question: 'How does corridor route matching work?',
    answer:
      'CarPool matches pickups and drop-offs along popular transit corridors (e.g. Chandigarh ↔ New Delhi, Mohali IT City ↔ Sector 17). Search queries match exact and regional hub addresses cleanly so passengers can find drivers passing through their pickup points.',
  },

  // Ride Cancellations
  {
    id: 'cancel-1',
    category: 'cancellations',
    question: 'Can I cancel my booking if my plans change?',
    answer:
      'Yes. You can cancel a pending or confirmed booking prior to ride departure directly from your "My Trips" dashboard. When you cancel, your reserved seat is automatically restored back to the driver\'s available capacity for other commuters.',
  },
  {
    id: 'cancel-2',
    category: 'cancellations',
    question: 'Can a ride be cancelled after it has started?',
    answer:
      'No. Once a driver updates the ride status to "In Progress" or "Completed", in-ride safety rules strictly lock the booking state to prevent midway disruptions and maintain driver/passenger accountability.',
  },

  // Accounts & Roles
  {
    id: 'acc-1',
    category: 'accounts',
    question: 'How are passenger and driver accounts separated?',
    answer:
      'CarPool enforces strict role separation. Passengers sign up with email/password or Google Sign-In to book rides. Drivers undergo a dedicated partner registration requiring verified vehicle model, license plate, license number, and mobile contact to access driver-specific dispatch tools.',
  },
  {
    id: 'acc-2',
    category: 'accounts',
    question: 'Can I use one login for both driving and riding?',
    answer:
      'Driver operations use a dedicated Driver Partner session with custom access controls. If you drive and also ride as a passenger, sign in to the Driver Portal for vehicle dispatch, or use passenger credentials for booking.',
  },

  // Pricing & Payments
  {
    id: 'pay-1',
    category: 'payments',
    question: 'How are fares calculated?',
    answer:
      'Fares are transparent and based on actual road distance, vehicle category (Sedan, SUV, Hatchback), and shared seat allocation. CarPool maintains a zero surge pricing policy to ensure daily commutes remain affordable and predictable.',
  },
  {
    id: 'pay-2',
    category: 'payments',
    question: 'What payment methods are supported?',
    answer:
      'CarPool supports cash on ride completion directly with the driver, as well as digital simulated payments and UPI workflows during booking checkout.',
  },

  // Live Tracking & Status
  {
    id: 'track-1',
    category: 'tracking',
    question: 'How do I track my ride in real time?',
    answer:
      'Once a ride is active, live GPS telemetry updates are transmitted via real-time websockets directly onto the interactive map. You can follow the vehicle’s progress, arrival updates, and route path on your booking screen.',
  },
  {
    id: 'track-2',
    category: 'tracking',
    question: 'What do the ride status stages mean?',
    answer:
      'Rides transition through verified lifecycle milestones: Confirmed (booking locked) → Driver Arriving (approaching pickup) → In Progress (trip underway) → Completed (journey finished, review unlocked).',
  },

  // Reporting Problems
  {
    id: 'prob-1',
    category: 'problems',
    question: 'How do I report an issue with a driver, passenger, or vehicle?',
    answer:
      'Navigate to the "Report a Problem" section from the support menu. Select the relevant issue category, reference your specific booking if applicable, and describe the incident. Your report is permanently logged under a tracking reference number for immediate review.',
  },
  {
    id: 'prob-2',
    category: 'problems',
    question: 'How can I check the status of my submitted support ticket?',
    answer:
      'If you were signed in when submitting a report, your report history and status (Open, In Progress, Resolved) are accessible from the Support Center dashboard.',
  },

  // Safety & Emergency
  {
    id: 'safe-1',
    category: 'safety',
    question: 'What should I do if I am in immediate danger or feel unsafe?',
    answer:
      'If you face an immediate emergency, call official local emergency services immediately (Dial 112 in India). If possible, ask the driver to stop at a well-lit public location, or move to safety before contacting CarPool support.',
  },
  {
    id: 'safe-2',
    category: 'safety',
    question: 'How do I contact CarPool customer support in an urgent situation?',
    answer:
      'CarPool provides 24/7 support availability via direct phone (+91 9103882218), WhatsApp (+91 9103882218), and email (aryan26@expandr.in). Please note: CarPool support assists with operational and booking concerns and is separate from municipal emergency police/ambulance services.',
  },
];

export default FAQ_ITEMS;
