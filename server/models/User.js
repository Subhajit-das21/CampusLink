const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema: The Identity Node
 * Manages authentication, OTP verification, and campus-specific profile telemetry.
 */
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    select: false // Automatically excludes password from query results for safety
  },
  
  // Campus Identity Fields (Synced with Profile.tsx)
  rollNumber: { 
    type: String, 
    required: true,
    unique: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  year: { 
    type: String, 
    default: '1st Year' 
  },

  // Security & Verification Nodes
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: {
    type: String,
    select: false // Protects OTP from being leaked in general API calls
  },
  otpExpires: {
    type: Date,
    select: false
  }
}, { timestamps: true });

/**
 * Pre-save Middleware: Password Encryption
 * Hashes the password using a salt before storing it in the database.
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method: Password Validation
 * Compares incoming plain-text password with the stored hash.
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);