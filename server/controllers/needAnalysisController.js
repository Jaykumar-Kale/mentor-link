const NeedAnalysis = require('../models/NeedAnalysis');
const User         = require('../models/User');

// POST /api/need-analysis
exports.submitNeedAnalysis = async (req, res) => {
  try {
    if (await NeedAnalysis.findOne({ mentee: req.user._id }))
      return res.status(400).json({ message: 'Need analysis already submitted. Contact admin to update.' });

    const { expectations, ratings, willMentorshipHelp, specificNeeds, willingToContact, preferredLanguage } = req.body;

    const form = await NeedAnalysis.create({
      mentee: req.user._id,
      expectations, ratings,
      willMentorshipHelp, specificNeeds, willingToContact,
      preferredLanguage: Array.isArray(preferredLanguage) ? preferredLanguage : [preferredLanguage],
    });

    await User.findByIdAndUpdate(req.user._id, { needAnalysisCompleted: true });
    res.status(201).json({ success: true, form });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/need-analysis/me
exports.getMyNeedAnalysis = async (req, res) => {
  try {
    const form = await NeedAnalysis.findOne({ mentee: req.user._id });
    if (!form) return res.status(404).json({ message: 'Not submitted yet', submitted: false });
    res.json({ success: true, form, submitted: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/need-analysis/:menteeId
exports.getNeedAnalysisByMentee = async (req, res) => {
  try {
    const form = await NeedAnalysis.findOne({ mentee: req.params.menteeId })
      .populate('mentee','name email college year');
    if (!form) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, form });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
