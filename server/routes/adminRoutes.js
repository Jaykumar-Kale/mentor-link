const express = require('express');
const router  = express.Router();
const {
  getDashboardStats, getAllUsers, runAutoMatch, getMatchSuggestions,
  manualMatch, createUser, updateUser, deleteUser,
  getAllSessions, getAllNeedAnalysis,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get ('/stats',                      getDashboardStats);
router.get ('/users',                      getAllUsers);
router.post('/users',                      createUser);
router.put ('/users/:id',                  updateUser);
router.delete('/users/:id',               deleteUser);
router.post('/auto-match',                 runAutoMatch);
router.get ('/match-suggestions/:menteeId',getMatchSuggestions);
router.post('/manual-match',               manualMatch);
router.get ('/sessions',                   getAllSessions);
router.get ('/need-analysis',              getAllNeedAnalysis);

module.exports = router;
