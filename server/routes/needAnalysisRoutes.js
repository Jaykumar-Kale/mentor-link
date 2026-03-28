const express = require('express');
const router  = express.Router();
const {
  submitNeedAnalysis, getMyNeedAnalysis, getNeedAnalysisByMentee,
} = require('../controllers/needAnalysisController');
const { protect, authorize } = require('../middleware/auth');

router.post('/',            protect, authorize('mentee'),         submitNeedAnalysis);
router.get ('/me',          protect,                              getMyNeedAnalysis);
router.get ('/:menteeId',   protect, authorize('admin','mentor'), getNeedAnalysisByMentee);

module.exports = router;
