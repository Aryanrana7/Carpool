const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture || null,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: role || 'rider',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture || null,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate or register passenger with Google ID Token
// @route   POST /api/users/google
// @access  Public
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential token is required' });
  }

  const rawClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientId = rawClientId ? rawClientId.trim().replace(/^["']|["']$/g, '') : null;
  if (!googleClientId) {
    return res.status(500).json({ message: 'Google authentication is not configured on the server' });
  }

  try {
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    if (!payload.email) {
      return res.status(400).json({ message: 'Google account does not have an associated email' });
    }

    if (!payload.email_verified) {
      return res.status(400).json({ message: 'Google email is not verified' });
    }

    const googleId = payload.sub;
    const normalizedEmail = payload.email.toLowerCase().trim();
    const name = payload.name || payload.given_name || 'Passenger';
    const picture = payload.picture || null;

    // 1. Check if user already linked to this Google ID
    let user = await User.findOne({ googleId });

    if (user) {
      // Update picture / name if they were missing
      if (!user.picture && picture) {
        user.picture = picture;
        await user.save();
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        token: generateToken(user._id),
      });
    }

    // 2. Check if email exists without Google ID linked
    const existingEmailUser = await User.findOne({ email: normalizedEmail });
    if (existingEmailUser) {
      // Prevent automatic takeover without password proof
      return res.status(409).json({
        message: 'An account with this email already exists. Please log in with your password first to link Google.',
        requiresPasswordAuth: true,
      });
    }

    // 3. Create new passenger account
    user = await User.create({
      name,
      email: normalizedEmail,
      googleId,
      picture,
      role: 'rider', // Always passenger
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth verification error:', error.message);
    if (error.message && (error.message.includes('Token used too early') || error.message.includes('Wrong number of segments') || error.message.includes('Invalid token') || error.message.includes('expired') || error.message.includes('audience mismatch') || error.message.includes('Wrong recipient'))) {
      return res.status(401).json({ message: 'Google authentication failed: Invalid or expired token' });
    }
    return res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

// @desc    Link Google account to existing logged-in user
// @route   POST /api/users/link-google
// @access  Private (Passenger)
const linkGoogleAccount = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential token is required' });
  }

  const rawClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientId = rawClientId ? rawClientId.trim().replace(/^["']|["']$/g, '') : null;
  if (!googleClientId) {
    return res.status(500).json({ message: 'Google authentication is not configured on the server' });
  }

  try {
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email_verified) {
      return res.status(400).json({ message: 'Invalid or unverified Google token' });
    }

    const googleId = payload.sub;

    // Ensure Google ID is not already used by someone else
    const existingGoogleUser = await User.findOne({ googleId });
    if (existingGoogleUser && existingGoogleUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'This Google account is already linked to another user.' });
    }

    const user = await User.findById(req.user._id);
    user.googleId = googleId;
    if (payload.picture && !user.picture) {
      user.picture = payload.picture;
    }
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      googleId: user.googleId,
      message: 'Google account linked successfully',
    });
  } catch (error) {
    console.error('Google account linking error:', error.message);
    return res.status(401).json({ message: 'Failed to verify Google token for linking' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  authUser,
  registerUser,
  googleAuth,
  linkGoogleAccount,
  getMe,
};
