const mongoose = require('mongoose');

/**
 * Service Schema: The Blueprint for Campus Nodes
 * Stores identity, spatial telemetry, and Google Places synchronization data.
 */
const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    index: true // Optimized for search lookups
  },
  category: { 
    type: String, 
    required: true, 
    trim: true,
    // enum: ['Str/eet Light', 'Road Safety', 'Food & Dining', 'Medical Support', 'Tech & Printing', 'Safety Concern', 'Water Supply'] 
  },
  description: { 
    type: String 
  },
  address: { 
    type: String
  },
  // Real-time synchronization fields
  isOpen: { 
    type: Boolean, 
    default: false 
  },
  placeId: {
    type: String,
    index: true // Essential for the systemSync.js script
  },
  statusLastChecked: {
    type: Date,
    default: null // Used by the route caching logic to save API credits
  },
  // Geospatial Telemetry
  lat: { 
    type: Number, 
    required: true 
  },
  lng: { 
    type: Number, 
    required: true 
  },
  // Extra metadata for the UI
  rating: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 2dsphere index for spatial proximity queries (e.g., "Services near me")
serviceSchema.index({ lat: 1, lng: 1 });

module.exports = mongoose.model('Service', serviceSchema);