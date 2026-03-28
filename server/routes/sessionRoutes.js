const express = require('express');
const router  = express.Router();
const {
  createSession, getMySessions, getSessionStats,
  updateSessionStatus, updateSession, deleteSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/',              createSession);
router.get ('/',              getMySessions);
router.get ('/stats',         getSessionStats);
router.put ('/:id/status',   updateSessionStatus);
router.put ('/:id',          updateSession);
router.delete('/:id',        deleteSession);

module.exports = router;
