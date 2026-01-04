const express = require('express');
const router = express.Router();
const { createReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All report routes are protected - users must be logged in
router.post('/', protect, createReport);
router.get('/me', protect, getMyReports);

module.exports = router;