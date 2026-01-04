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
 * @route   POST /api/auth/register (or /api/auth/signup)
 */
exports.register = async (req, res) => {
  // ✅ Accept both 'name' and 'username' from frontend
  const { name, username, email, password, rollNumber, department } = req.body;
  
  // ✅ Use 'name' if provided, otherwise fall back to 'username'
  const finalUsername = name || username;
  
  console.log('📝 Registration attempt:', { finalUsername, email, rollNumber, department });
  
  try {
    // ✅ Validation with better error message
    if (!finalUsername || !email || !password || !rollNumber || !department) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'All fields are required (name, email, password, rollNumber, department)' 
      });
    }

    // Check for existing identity
    const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Conflict', 
        message: 'Identity or Roll Number already registered.' 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({ 
      username: finalUsername,  // ✅ Use the finalUsername variable
      email, 
      password, 
      rollNumber, 
      department,
      otp, 
      otpExpires: Date.now() + 600000 // 10 Min Window
    });
    
    await user.save();
    
    console.log('✅ User created:', user._id);
    
    // ✅ Try to send OTP email, but don't fail registration if email fails
    try {
      await sendOTPEmail(email, otp);
      console.log('📧 OTP email sent to:', email);
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
      // Continue anyway - user is created
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Security key dispatched to campus email.',
      // ✅ For development: include OTP in response (remove in production!)
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Initialization Failed', 
      message: error.message 
    });
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
      return res.status(400).json({ 
        error: 'Invalid Key', 
        message: 'Key expired or incorrect.' 
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // ✅ Generate token after verification
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      success: true,
      status: 'Verified', 
      message: 'Account node successfully linked.',
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department
      }
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Verification Failure', 
      message: error.message 
    });
  }
};

/**
 * @desc    Authenticate & Generate Access Key (JWT)
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  // ✅ Accept both formats: {email, password} or {identifier, password}
  const { identifier, email, password } = req.body;
  const loginIdentifier = identifier || email;
  
  console.log('🔐 Login attempt:', loginIdentifier);
  
  try {
    if (!loginIdentifier || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation Error', 
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ 
      $or: [{ email: loginIdentifier }, { rollNumber: loginIdentifier }] 
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication Failed', 
        message: 'Invalid credentials.' 
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false,
        error: 'Unverified', 
        message: 'Please verify your campus email first.' 
      });
    }

    // Generate JWT Node Access Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login successful:', user._id);

    res.status(200).json({ 
      success: true,
      token, 
      user: { 
        id: user._id,
        name: user.username,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department
      } 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login Link Failure', 
      message: error.message 
    });
  }
};

/**
 * @desc    Fetch Current User Telemetry
 * @route   GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    // req.user is already provided by the 'protect' middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('❌ GetMe error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Telemetry Failure', 
      message: error.message 
    });
  }
};
