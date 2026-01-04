const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * Helper: SMTP Transporter Node
 * Configured for secure campus email delivery.
 */
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
  });

  await transporter.sendMail({
    from: '"CampusLink Security" <no-reply@campuslink.com>',
    to: email,
    subject: 'CampusLink | Your Security Access Key',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #0AD1C8; border-radius: 10px;">
        <h2 style="color: #0AD1C8;">Identity Verification</h2>
        <p>Your OTP access key is:</p>
        <h1 style="letter-spacing: 5px; color: #051923;">${otp}</h1>
        <p>This key expires in 10 minutes. Do not share this with anyone.</p>
      </div>
    `
  });
};

/**
 * @desc    Register a new Identity Node
 * @route   POST /api/auth/register
 */
exports.register = async (req, res) => {
  const { username, email, password, rollNumber, department } = req.body;
  try {
    // Check for existing identity
    const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Conflict', message: 'Identity or Roll Number already registered.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({ 
      username, 
      email, 
      password, 
      rollNumber, 
      department,
      otp, 
      otpExpires: Date.now() + 600000 // 10 Min Window
    });
    
    await user.save();
    await sendOTPEmail(email, otp);
    
    res.status(201).json({ message: 'Security key dispatched to campus email.' });
  } catch (error) {
    res.status(500).json({ error: 'Initialization Failed', message: error.message });
  }
};

/**
 * @desc    Validate Security Key (OTP)
 * @route   POST /api/auth/verify
 */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid Key', message: 'Key expired or incorrect.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ status: 'Verified', message: 'Account node successfully linked.' });
  } catch (error) {
    res.status(500).json({ error: 'Verification Failure', message: error.message });
  }
};

/**
 * @desc    Authenticate & Generate Access Key (JWT)
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { identifier, password } = req.body; // Identifier can be email or rollNumber
  try {
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { rollNumber: identifier }] 
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Authentication Failed', message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Unverified', message: 'Please verify your campus email first.' });
    }

    // Generate JWT Node Access Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { 
        id: user._id,
        username: user.username, 
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login Link Failure', message: error.message });
  }
};

/**
 * @desc    Fetch Current User Telemetry
 * @route   GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    // req.user is already provided by the 'protect' middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: 'Telemetry Failure', message: error.message });
  }
};