const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
      index: true,
    },
    userType: {
      type: String,
      enum: ['passenger', 'driver', 'guest'],
      default: 'guest',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['app_experience', 'feature_request', 'driver_experience', 'pricing', 'general'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
      maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    contactPreference: {
      type: String,
      enum: ['none', 'email', 'phone'],
      default: 'none',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
