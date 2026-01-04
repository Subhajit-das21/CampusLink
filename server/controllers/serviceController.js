const Service = require('../models/Service');

/**
 * @desc    Get all network nodes with optional filtering
 * @route   GET /api/services
 * @access  Public (or Protected via AuthGuard)
 */
exports.getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // 1. Category Filter Logic
    if (category && category !== 'All') {
      query.category = category;
    }

    // 2. Fuzzy Search Logic (Name or Description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query).sort({ name: 1 });
    
    res.status(200).json({
      count: services.length,
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Nexus Registry Failure", 
      message: error.message 
    });
  }
};

/**
 * @desc    Get detailed telemetry for a single node
 * @route   GET /api/services/:id
 * @access  Protected
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ 
        error: "Node Not Found", 
        message: "The requested campus node is not registered in the local matrix." 
      });
    }

    res.status(200).json(service);
  } catch (error) {
    // Handling invalid MongoDB ObjectIDs
    res.status(400).json({ 
      error: "Invalid Protocol", 
      message: "The provided Node ID format is unrecognizable." 
    });
  }
};