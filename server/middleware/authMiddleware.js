const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for Header and Bearer Prefix
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch User and Attach to Request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          error: 'Nexus Identity Lost', 
          message: 'User no longer exists in the registry.' 
        });
      }

      // 4. Verification Check
      if (!req.user.isVerified && req.path !== '/verify') {
        return res.status(403).json({ 
          error: 'Identity Unverified', 
          message: 'Complete OTP verification to access secure nodes.' 
        });
      }

      return next(); // 🚀 IMPORTANT: Return here to stop execution
    } catch (error) {
      console.error("❌ Verification failed:", error.message);
      return res.status(401).json({ 
        error: 'Not authorized', 
        message: error.name === 'TokenExpiredError' ? 'Key expired.' : 'Invalid key signature.' 
      });
    }
  }

  // 5. If no token was found at all
  if (!token) {
    return res.status(401).json({ 
      error: 'Not authorized', 
      message: 'No access key found. Security handshake failed.' 
    });
  }
};

module.exports = { protect };