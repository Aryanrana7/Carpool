const mongoose = require('mongoose');
const SupportTicket = require('../models/SupportTicket');
const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// Helper to generate a collision-resistant, human-friendly ticket ID
const generateTicketId = (prefix = 'CP') => {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};

// 1. Submit general contact inquiry
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, role, category, subject, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Determine user role and authenticated identity from server-verified session
    let user = null;
    let driver = null;
    let userType = 'guest';

    if (req.user) {
      user = req.user._id;
      userType = 'passenger';
    } else if (req.driver) {
      driver = req.driver._id;
      userType = 'driver';
    } else if (role === 'driver' || role === 'passenger') {
      userType = role;
    }

    const validCategory = [
      'booking_cancellation',
      'ride_issue',
      'account_login',
      'tracking_map',
      'safety_concern',
      'technical',
      'general_inquiry',
      'other',
    ].includes(category)
      ? category
      : 'general_inquiry';

    const ticket = new SupportTicket({
      ticketId: generateTicketId('CP-CNT'),
      user,
      driver,
      userType,
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      phone: phone ? String(phone).trim().slice(0, 20) : null,
      category: validCategory,
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 3000),
      type: 'contact',
      status: 'open',
    });

    await ticket.save();

    return res.status(201).json({
      success: true,
      ticketId: ticket.ticketId,
      message: 'Your inquiry has been received. Our team will review your message shortly.',
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    console.error('Support submitContact error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Failed to submit contact message. Please try again.' });
  }
};

// 2. Submit problem / incident / safety report
exports.submitReport = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      subject,
      description,
      relatedBookingId,
      relatedRideId,
      isEmergency,
    } = req.body;

    const message = description || req.body.message;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Contact email is required' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ message: 'Issue category is required' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Problem description is required' });
    }

    let user = null;
    let driver = null;
    let userType = 'guest';

    if (req.user) {
      user = req.user._id;
      userType = 'passenger';
    } else if (req.driver) {
      driver = req.driver._id;
      userType = 'driver';
    }

    // Validate relatedBooking if supplied
    let validBookingId = null;
    if (relatedBookingId) {
      if (!mongoose.Types.ObjectId.isValid(relatedBookingId)) {
        return res.status(400).json({ message: 'Invalid related booking ID format' });
      }

      const booking = await Booking.findById(relatedBookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Referenced booking not found' });
      }

      // Security check: If authenticated, booking must belong to user or driver
      if (req.user && String(booking.user) !== String(req.user._id)) {
        return res.status(403).json({ message: 'You are not authorized to report on this booking' });
      }
      if (req.driver && String(booking.driver) !== String(req.driver._id)) {
        return res.status(403).json({ message: 'You are not authorized to report on this booking' });
      }

      validBookingId = booking._id;
    }

    // Validate relatedRide if supplied
    let validRideId = null;
    if (relatedRideId) {
      if (!mongoose.Types.ObjectId.isValid(relatedRideId)) {
        return res.status(400).json({ message: 'Invalid related ride ID format' });
      }

      const ride = await Ride.findById(relatedRideId);
      if (!ride) {
        return res.status(404).json({ message: 'Referenced ride not found' });
      }
      validRideId = ride._id;
    }

    const validCategory = [
      'booking_cancellation',
      'ride_issue',
      'account_login',
      'tracking_map',
      'safety_concern',
      'technical',
      'general_inquiry',
      'other',
    ].includes(category)
      ? category
      : 'other';

    const type = isEmergency || category === 'safety_concern'
      ? 'safety_incident'
      : 'problem_report';

    const ticket = new SupportTicket({
      ticketId: generateTicketId(type === 'safety_incident' ? 'CP-SFT' : 'CP-RPT'),
      user,
      driver,
      userType,
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      phone: phone ? String(phone).trim().slice(0, 20) : null,
      category: validCategory,
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 3000),
      type,
      relatedBooking: validBookingId,
      relatedRide: validRideId,
      status: 'open',
    });

    await ticket.save();

    return res.status(201).json({
      success: true,
      ticketId: ticket.ticketId,
      message: 'Your report has been submitted successfully and logged for review.',
      status: ticket.status,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    console.error('Support submitReport error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Failed to submit report. Please try again.' });
  }
};

// 3. Get reports submitted by the authenticated user / driver
exports.getMyReports = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query.user = req.user._id;
    } else if (req.driver) {
      query.driver = req.driver._id;
    } else {
      return res.status(401).json({ message: 'Authentication required to view reports' });
    }

    const tickets = await SupportTicket.find(query)
      .select('ticketId category subject message status type createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ success: true, tickets });
  } catch (error) {
    console.error('Support getMyReports error:', error);
    return res.status(500).json({ message: 'Failed to retrieve reports' });
  }
};

// 4. Submit product feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { category, rating, message, contactPreference, email } = req.body;

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ message: 'Feedback category is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    const validCategories = [
      'app_experience',
      'feature_request',
      'driver_experience',
      'pricing',
      'general',
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid feedback category' });
    }

    let parsedRating = null;
    if (rating !== undefined && rating !== null && rating !== '') {
      const num = Number(rating);
      if (num >= 1 && num <= 5) {
        parsedRating = Math.round(num);
      }
    }

    let user = null;
    let driver = null;
    let userType = 'guest';

    if (req.user) {
      user = req.user._id;
      userType = 'passenger';
    } else if (req.driver) {
      driver = req.driver._id;
      userType = 'driver';
    }

    const feedback = new Feedback({
      user,
      driver,
      userType,
      category,
      rating: parsedRating,
      message: message.trim().slice(0, 2000),
      contactPreference: ['none', 'email', 'phone'].includes(contactPreference)
        ? contactPreference
        : 'none',
      email: email ? String(email).trim().toLowerCase().slice(0, 150) : null,
    });

    await feedback.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your submission helps us improve CarPool.',
      id: feedback._id,
    });
  } catch (error) {
    console.error('Support submitFeedback error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Failed to submit feedback. Please try again.' });
  }
};
