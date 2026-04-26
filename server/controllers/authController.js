const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const emailService = require('../services/emailService');

// Generate OTP Code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user (unverified)
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'candidate',
    otpCode: otp,
    otpExpire: otpExpire,
    isVerified: false,
  });

  if (user) {
    // Send OTP email
    try {
      await emailService.sendOTPEmail(email, name, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user (include password field)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if user is verified
  if (!user.isVerified) {
    res.status(403);
    throw new Error('Please verify your email first. Check your inbox for OTP.');
  }

  // Check if recruiter is approved
  if (user.role === 'recruiter' && !user.isApproved) {
    res.status(403);
    throw new Error('Your recruiter account is pending approval');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    },
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Please provide email and OTP');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Account already verified. Please login.');
  }

  // Check if OTP matches
  if (user.otpCode !== otp) {
    res.status(400);
    throw new Error('Invalid OTP code');
  }

  // Check if OTP is expired
  if (new Date() > user.otpExpire) {
    res.status(400);
    throw new Error('OTP has expired. Please request a new one.');
  }

  // Verify user
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpire = undefined;
  await user.save();

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(user.email, user.name, user.role);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }

  res.json({
    success: true,
    message: 'Email verified successfully! You can now login.',
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Account already verified. Please login.');
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otpCode = otp;
  user.otpExpire = otpExpire;
  await user.save();

  // Send new OTP email
  try {
    await emailService.sendOTPEmail(user.email, user.name, otp);
  } catch (emailError) {
    console.error('Failed to send OTP email:', emailError);
    res.status(500);
    throw new Error('Failed to send OTP email');
  }

  res.json({
    success: true,
    message: 'New OTP sent to your email',
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user,
  });
});
