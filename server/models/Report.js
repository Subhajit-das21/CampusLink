const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Street Light', 'Road Safety', 'Water Supply', 'Safety Concern', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  image: {
    type: String // URL or Base64 string for evidence
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);