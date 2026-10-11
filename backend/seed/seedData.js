const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const DEMO_PASSWORD = 'DemoPass123!';

const CITIES = {
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Mohali: { lat: 30.7046, lng: 76.7179 },
  Panchkula: { lat: 30.6942, lng: 76.8606 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Shimla: { lat: 31.1048, lng: 77.1734 },
  Amritsar: { lat: 31.6340, lng: 74.8723 },
  Ludhiana: { lat: 30.9010, lng: 75.8573 },
};

const DEMO_DRIVERS_DATA = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.demo@carpool.test',
    carModel: 'Maruti Swift (White)',
    carNumber: 'DL-01-AB-1234',
    currentLocation: CITIES.Chandigarh,
    averageRating: 4.9,
    totalReviews: 48,
  },
  {
    name: 'Priya Verma',
    email: 'priya.demo@carpool.test',
    carModel: 'Hyundai i20 (Silver)',
    carNumber: 'CH-01-CD-5678',
    currentLocation: CITIES.Mohali,
    averageRating: 4.8,
    totalReviews: 35,
  },
  {
    name: 'Arjun Singh',
    email: 'arjun.demo@carpool.test',
    carModel: 'Tata Nexon (Blue)',
    carNumber: 'PB-65-EF-9012',
    currentLocation: CITIES.Chandigarh,
    averageRating: 5.0,
    totalReviews: 62,
  },
  {
    name: 'Neha Kapoor',
    email: 'neha.demo@carpool.test',
    carModel: 'Honda City (Grey)',
    carNumber: 'CH-01-GH-3456',
    currentLocation: CITIES.Chandigarh,
    averageRating: 4.7,
    totalReviews: 29,
  },
  {
    name: 'Aman Thakur',
    email: 'aman.demo@carpool.test',
    carModel: 'Mahindra XUV300 (Red)',
    carNumber: 'HP-01-IJ-7890',
    currentLocation: CITIES.Shimla,
    averageRating: 4.9,
    totalReviews: 51,
  },
  {
    name: 'Simran Kaur',
    email: 'simran.demo@carpool.test',
    carModel: 'Maruti Baleno (Silver)',
    carNumber: 'DL-04-KL-2345',
    currentLocation: CITIES.Delhi,
    averageRating: 4.8,
    totalReviews: 40,
  },
];

const DEMO_PASSENGERS_DATA = [
  {
    name: 'Aditi Mehta',
    email: 'aditi.demo@carpool.test',
    role: 'rider',
    averageRating: 4.9,
    totalReviews: 12,
  },
  {
    name: 'Karan Malhotra',
    email: 'karan.demo@carpool.test',
    role: 'rider',
    averageRating: 4.7,
    totalReviews: 8,
  },
  {
    name: 'Meera Sharma',
    email: 'meera.demo@carpool.test',
    role: 'rider',
    averageRating: 5.0,
    totalReviews: 15,
  },
  {
    name: 'Dev Patel',
    email: 'dev.demo@carpool.test',
    role: 'rider',
    averageRating: 4.8,
    totalReviews: 6,
  },
];

// Helper to create dynamically generated future dates (+ hours)
const getFutureDate = (hoursFromNow) => {
  const d = new Date();
  d.setHours(d.getHours() + hoursFromNow);
  return d;
};

const DEMO_RIDES_TEMPLATE = [
  {
    driverEmail: 'rahul.demo@carpool.test',
    source: 'Chandigarh',
    destination: 'Delhi',
    sourceCoords: CITIES.Chandigarh,
    destinationCoords: CITIES.Delhi,
    hoursAhead: 8,
    initialSeats: 3,
    price: 38,
    carType: 'Maruti Swift',
    rideType: 'sedan',
  },
  {
    driverEmail: 'simran.demo@carpool.test',
    source: 'Delhi',
    destination: 'Chandigarh',
    sourceCoords: CITIES.Delhi,
    destinationCoords: CITIES.Chandigarh,
    hoursAhead: 14,
    initialSeats: 4,
    price: 36,
    carType: 'Maruti Baleno',
    rideType: 'sedan',
  },
  {
    driverEmail: 'priya.demo@carpool.test',
    source: 'Mohali',
    destination: 'Shimla',
    sourceCoords: CITIES.Mohali,
    destinationCoords: CITIES.Shimla,
    hoursAhead: 18,
    initialSeats: 3,
    price: 25,
    carType: 'Hyundai i20',
    rideType: 'mini',
  },
  {
    driverEmail: 'aman.demo@carpool.test',
    source: 'Shimla',
    destination: 'Chandigarh',
    sourceCoords: CITIES.Shimla,
    destinationCoords: CITIES.Chandigarh,
    hoursAhead: 22,
    initialSeats: 4,
    price: 26,
    carType: 'Mahindra XUV300',
    rideType: 'suv',
  },
  {
    driverEmail: 'arjun.demo@carpool.test',
    source: 'Chandigarh',
    destination: 'Amritsar',
    sourceCoords: CITIES.Chandigarh,
    destinationCoords: CITIES.Amritsar,
    hoursAhead: 28,
    initialSeats: 3,
    price: 32,
    carType: 'Tata Nexon',
    rideType: 'suv',
  },
  {
    driverEmail: 'arjun.demo@carpool.test',
    source: 'Amritsar',
    destination: 'Chandigarh',
    sourceCoords: CITIES.Amritsar,
    destinationCoords: CITIES.Chandigarh,
    hoursAhead: 36,
    initialSeats: 4,
    price: 30,
    carType: 'Tata Nexon',
    rideType: 'suv',
  },
  {
    driverEmail: 'neha.demo@carpool.test',
    source: 'Chandigarh',
    destination: 'Ludhiana',
    sourceCoords: CITIES.Chandigarh,
    destinationCoords: CITIES.Ludhiana,
    hoursAhead: 40,
    initialSeats: 3,
    price: 18,
    carType: 'Honda City',
    rideType: 'sedan',
  },
  {
    driverEmail: 'neha.demo@carpool.test',
    source: 'Ludhiana',
    destination: 'Chandigarh',
    sourceCoords: CITIES.Ludhiana,
    destinationCoords: CITIES.Chandigarh,
    hoursAhead: 48,
    initialSeats: 3,
    price: 18,
    carType: 'Honda City',
    rideType: 'sedan',
  },
  {
    driverEmail: 'rahul.demo@carpool.test',
    source: 'Panchkula',
    destination: 'Delhi',
    sourceCoords: CITIES.Panchkula,
    destinationCoords: CITIES.Delhi,
    hoursAhead: 54,
    initialSeats: 3,
    price: 40,
    carType: 'Maruti Swift',
    rideType: 'sedan',
  },
  {
    driverEmail: 'simran.demo@carpool.test',
    source: 'Delhi',
    destination: 'Shimla',
    sourceCoords: CITIES.Delhi,
    destinationCoords: CITIES.Shimla,
    hoursAhead: 60,
    initialSeats: 3,
    price: 52,
    carType: 'Maruti Baleno',
    rideType: 'sedan',
  },
  {
    driverEmail: 'priya.demo@carpool.test',
    source: 'Chandigarh',
    destination: 'Mohali',
    sourceCoords: CITIES.Chandigarh,
    destinationCoords: CITIES.Mohali,
    hoursAhead: 66,
    initialSeats: 2,
    price: 8,
    carType: 'Hyundai i20',
    rideType: 'mini',
  },
  {
    driverEmail: 'priya.demo@carpool.test',
    source: 'Mohali',
    destination: 'Chandigarh',
    sourceCoords: CITIES.Mohali,
    destinationCoords: CITIES.Chandigarh,
    hoursAhead: 72,
    initialSeats: 3,
    price: 8,
    carType: 'Hyundai i20',
    rideType: 'mini',
  },
];

async function seedDatabase(customUri = null) {
  const mongoUri = customUri || process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('CRITICAL: MONGO_URI is not set in environment or arguments.');
    process.exit(1);
  }

  console.log('Connecting to database for demo seeding...');
  const conn = await mongoose.connect(mongoUri);
  console.log(`Connected to: ${conn.connection.host} (${conn.connection.name})`);

  const summary = {
    driversCreated: 0,
    driversUpdated: 0,
    passengersCreated: 0,
    passengersUpdated: 0,
    ridesCreated: 0,
    ridesUpdated: 0,
    bookingsCreated: 0,
    bookingsUpdated: 0,
    reviewsCreated: 0,
    reviewsUpdated: 0,
  };

  // 1. Seed Demo Drivers
  const driverMap = new Map();
  for (const drvData of DEMO_DRIVERS_DATA) {
    let driver = await Driver.findOne({ email: drvData.email });
    if (!driver) {
      driver = await Driver.create({
        ...drvData,
        password: DEMO_PASSWORD,
      });
      summary.driversCreated++;
    } else {
      driver.name = drvData.name;
      driver.carModel = drvData.carModel;
      driver.carNumber = drvData.carNumber;
      driver.currentLocation = drvData.currentLocation;
      driver.averageRating = drvData.averageRating;
      driver.totalReviews = drvData.totalReviews;
      driver.password = DEMO_PASSWORD;
      await driver.save();
      summary.driversUpdated++;
    }
    driverMap.set(drvData.email, driver);
  }

  // 2. Seed Demo Passengers
  const passengerMap = new Map();
  for (const paxData of DEMO_PASSENGERS_DATA) {
    let user = await User.findOne({ email: paxData.email });
    if (!user) {
      user = await User.create({
        ...paxData,
        password: DEMO_PASSWORD,
      });
      summary.passengersCreated++;
    } else {
      user.name = paxData.name;
      user.role = paxData.role;
      user.averageRating = paxData.averageRating;
      user.totalReviews = paxData.totalReviews;
      user.password = DEMO_PASSWORD;
      await user.save();
      summary.passengersUpdated++;
    }
    passengerMap.set(paxData.email, user);
  }

  // 3. Seed Demo Rides
  const rideMap = new Map();
  for (const template of DEMO_RIDES_TEMPLATE) {
    const driver = driverMap.get(template.driverEmail);
    if (!driver) continue;

    const rideKey = `${template.source}->${template.destination} (${driver.email})`;
    let ride = await Ride.findOne({
      driver: driver._id,
      source: template.source,
      destination: template.destination,
    });

    const departureTime = getFutureDate(template.hoursAhead);

    if (!ride) {
      ride = await Ride.create({
        driver: driver._id,
        source: template.source,
        destination: template.destination,
        sourceCoords: template.sourceCoords,
        destinationCoords: template.destinationCoords,
        time: departureTime,
        seats: template.initialSeats,
        price: template.price,
        carType: template.carType,
        rideType: template.rideType,
        status: 'active',
      });
      summary.ridesCreated++;
    } else {
      // Refresh time into the future on re-seed
      ride.time = departureTime;
      ride.sourceCoords = template.sourceCoords;
      ride.destinationCoords = template.destinationCoords;
      ride.price = template.price;
      ride.carType = template.carType;
      ride.rideType = template.rideType;
      ride.status = 'active';
      await ride.save();
      summary.ridesUpdated++;
    }
    rideMap.set(rideKey, ride);
  }

  // 4. Seed Managed Sample Bookings
  // Booking 1: Aditi -> Chandigarh to Delhi (Confirmed)
  const aditi = passengerMap.get('aditi.demo@carpool.test');
  const chdToDelRide = rideMap.get('Chandigarh->Delhi (rahul.demo@carpool.test)');

  if (aditi && chdToDelRide) {
    let booking1 = await Booking.findOne({ user: aditi._id, ride: chdToDelRide._id });
    if (!booking1) {
      booking1 = await Booking.create({
        user: aditi._id,
        ride: chdToDelRide._id,
        status: 'confirmed',
        paymentStatus: 'simulated_paid',
      });
      summary.bookingsCreated++;
    } else {
      booking1.status = 'confirmed';
      booking1.paymentStatus = 'simulated_paid';
      await booking1.save();
      summary.bookingsUpdated++;
    }
  }

  // Booking 2: Karan -> Mohali to Shimla (Pending)
  const karan = passengerMap.get('karan.demo@carpool.test');
  const mohaliToShimlaRide = rideMap.get('Mohali->Shimla (priya.demo@carpool.test)');

  if (karan && mohaliToShimlaRide) {
    let booking2 = await Booking.findOne({ user: karan._id, ride: mohaliToShimlaRide._id });
    if (!booking2) {
      booking2 = await Booking.create({
        user: karan._id,
        ride: mohaliToShimlaRide._id,
        status: 'pending',
        paymentStatus: 'simulated_paid',
      });
      summary.bookingsCreated++;
    } else {
      booking2.status = 'pending';
      booking2.paymentStatus = 'simulated_paid';
      await booking2.save();
      summary.bookingsUpdated++;
    }
  }

  // Booking 3: Meera -> Chandigarh to Amritsar (Completed)
  const meera = passengerMap.get('meera.demo@carpool.test');
  const chdToAsrRide = rideMap.get('Chandigarh->Amritsar (arjun.demo@carpool.test)');

  let completedBooking = null;
  if (meera && chdToAsrRide) {
    let booking3 = await Booking.findOne({ user: meera._id, ride: chdToAsrRide._id });
    if (!booking3) {
      booking3 = await Booking.create({
        user: meera._id,
        ride: chdToAsrRide._id,
        status: 'completed',
        paymentStatus: 'simulated_paid',
      });
      summary.bookingsCreated++;
    } else {
      booking3.status = 'completed';
      booking3.paymentStatus = 'simulated_paid';
      await booking3.save();
      summary.bookingsUpdated++;
    }
    completedBooking = booking3;
  }

  // 5. Seed Reviews for the Completed Booking
  if (completedBooking && meera && chdToAsrRide) {
    const arjunDriver = driverMap.get('arjun.demo@carpool.test');
    
    // User Review of Driver
    let userReview = await Review.findOne({
      booking: completedBooking._id,
      reviewerType: 'user',
    });

    if (!userReview) {
      await Review.create({
        booking: completedBooking._id,
        user: meera._id,
        driver: arjunDriver._id,
        rating: 5,
        reviewText: 'Great ride with Arjun! Smooth driving, clean car, on time departure.',
        reviewerType: 'user',
      });
      summary.reviewsCreated++;
    } else {
      userReview.rating = 5;
      userReview.reviewText = 'Great ride with Arjun! Smooth driving, clean car, on time departure.';
      await userReview.save();
      summary.reviewsUpdated++;
    }

    // Driver Review of User
    let driverReview = await Review.findOne({
      booking: completedBooking._id,
      reviewerType: 'driver',
    });

    if (!driverReview) {
      await Review.create({
        booking: completedBooking._id,
        user: meera._id,
        driver: arjunDriver._id,
        rating: 5,
        reviewText: 'Meera was a polite and punctual passenger. Highly recommended!',
        reviewerType: 'driver',
      });
      summary.reviewsCreated++;
    } else {
      driverReview.rating = 5;
      driverReview.reviewText = 'Meera was a polite and punctual passenger. Highly recommended!';
      await driverReview.save();
      summary.reviewsUpdated++;
    }
  }

  // 6. Recalculate seats for all demo rides to ensure accurate seat availability
  for (const [, ride] of rideMap) {
    const activeBookings = await Booking.countDocuments({
      ride: ride._id,
      status: { $in: ['pending', 'confirmed', 'in_progress'] },
    });
    const template = DEMO_RIDES_TEMPLATE.find(
      (t) => t.source === ride.source && t.destination === ride.destination
    );
    const initialCapacity = template ? template.initialSeats : 4;
    ride.seats = Math.max(0, initialCapacity - activeBookings);
    await ride.save();
  }

  console.log('--- DEMO SEED COMPLETED SUCCESSFULLY ---');
  console.log(`Drivers:    ${summary.driversCreated} created, ${summary.driversUpdated} updated`);
  console.log(`Passengers: ${summary.passengersCreated} created, ${summary.passengersUpdated} updated`);
  console.log(`Rides:      ${summary.ridesCreated} created, ${summary.ridesUpdated} updated`);
  console.log(`Bookings:   ${summary.bookingsCreated} created, ${summary.bookingsUpdated} updated`);
  console.log(`Reviews:    ${summary.reviewsCreated} created, ${summary.reviewsUpdated} updated`);
  console.log(`Demo Password: ${DEMO_PASSWORD}`);

  return summary;
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Closing database connection...');
      return mongoose.connection.close();
    })
    .then(() => {
      console.log('Seed process finished cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed process encountered an error:', err);
      mongoose.connection.close().finally(() => process.exit(1));
    });
}

module.exports = seedDatabase;
