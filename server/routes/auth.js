const express = require('express');
const router = express.Router();
const { 
  register, 
  verifyOTP, 
  login, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware.js');

/**
 * @route   POST /api/auth/register
 * @desc    Initialize a new Identity Node (Sends OTP to campus email)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/verify
 * @desc    Validate OTP and activate account session
 * @access  Public
 */
router.post('/verify', verifyOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate existing Identity Node & return JWT Access Key
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Fetch current User Telemetry (Profile Data)
 * @access  Protected (Requires Bearer Token)
 */
router.get('/me', protect, getMe);

module.exports = router;