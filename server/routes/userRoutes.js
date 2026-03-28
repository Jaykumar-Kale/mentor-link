const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/mentors
router.get('/mentors', protect, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor', isActive: true })
      .select('name email organization yearsOfExperience languagesKnown expertise profilePhoto phone');
    res.json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/mentor/:id
router.get('/mentor/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
