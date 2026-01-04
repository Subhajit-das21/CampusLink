const Report = require('../models/Report');

// Submit a new issue
exports.createReport = async (req, res) => {
  try {
    const { type, description, location, image } = req.body;
    
    const newReport = new Report({
      user: req.user.id, // Taken from 'protect' middleware
      type,
      description,
      location,
      image
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ error: 'Report submission failed', message: error.message });
  }
};

// Get reports for the logged-in user (For Profile.tsx)
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your reports' });
  }
};