const express = require('express');
const scholarshipController = require('../controllers/scholarshipController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route - submit application (no auth required)
router.post('/submit', scholarshipController.submitApplication);

// Protected routes - admin only
router.get('/', protect, scholarshipController.getAllApplications);
router.get('/:id', protect, scholarshipController.getApplication);
router.put('/:id/status', protect, scholarshipController.updateApplicationStatus);

module.exports = router;
