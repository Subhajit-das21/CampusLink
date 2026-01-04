const express = require('express');
const router = express.Router();
const axios = require('axios');
const Service = require('../models/Service');

/**
 * Helper: Status Synchronization Node
 * Fetches real-time "Open Now" status from Google Places API.
 * Includes a 15-minute cache guard to save API credits.
 */
async function updateServiceStatus(service) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!API_KEY) {
    console.error("⚠️ [NEXUS]: Missing API Key for Status Sync.");
    return service;
  }

  if (!service.placeId) return service;

  // Cache Guard: Only update if the last check was > 15 mins ago
  const FIFTEEN_MINUTES = 15 * 60 * 1000;
  const isCacheFresh = service.statusLastChecked && 
                      (new Date() - new Date(service.statusLastChecked) < FIFTEEN_MINUTES);

  if (isCacheFresh) return service;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${service.placeId}&fields=opening_hours&key=${API_KEY}`;
  
  try {
    const response = await axios.get(url);
    const isOpenNow = response.data.result?.opening_hours?.open_now;
    
    if (typeof isOpenNow !== 'undefined') {
      service.isOpen = isOpenNow;
      service.statusLastChecked = new Date(); // Update the timestamp
      await service.save();
      console.log(`🌐 [SYNC]: Updated status for ${service.name} (Result: ${isOpenNow ? 'OPEN' : 'CLOSED'})`);
    }
    return service;
  } catch (error) {
    console.error(`❌ [SYNC FAILURE]: ${service.name} ->`, error.message);
    return service;
  }
}

/**
 * @route   GET /api/services
 * @desc    Fetch all campus nodes
 */
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch network nodes' });
  }
});

/**
 * @route   GET /api/services/:id
 * @desc    Fetch single node with Real-time Telemetry
 */
router.get('/:id', async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Node not found in local registry' });

    // Perform live status check before delivery
    service = await updateServiceStatus(service);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Nexus connection failure' });
  }
});

module.exports = router;