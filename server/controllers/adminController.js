const User         = require('../models/User');
const Session      = require('../models/Session');
const NeedAnalysis = require('../models/NeedAnalysis');
const { autoMatchAll, getSuggestionsForMentee } = require('../utils/matching');

// GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalMentors, totalMentees, totalSessions, matched, needDone, completed] = await Promise.all([
      User.countDocuments({ role: 'mentor' }),
      User.countDocuments({ role: 'mentee' }),
      Session.countDocuments(),
      User.countDocuments({ role: 'mentee', isMatched: true }),
      User.countDocuments({ role: 'mentee', needAnalysisCompleted: true }),
      Session.countDocuments({ status: 'completed' }),
    ]);
    res.json({ success: true, stats: {
      totalMentors, totalMentees, totalSessions,
      matched, unmatched: totalMentees - matched,
      needDone, completedSessions: completed,
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users?role=&search=&page=&limit=
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isMatched, page = 1, limit = 20, search } = req.query;
    const q = {};
    if (role) q.role = role;
    if (isMatched !== undefined) q.isMatched = isMatched === 'true';
    if (search) q.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(q);
    const users = await User.find(q).select('-password')
      .populate('assignedMentor', 'name email')
      .populate('assignedMentees','name email')
      .limit(Number(limit)).skip((page - 1) * limit).sort({ createdAt: -1 });
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/auto-match
exports.runAutoMatch = async (req, res) => {
  try {
    const results = await autoMatchAll();
    res.json({ success: true, message: `Matched ${results.length} mentee(s)`, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/match-suggestions/:menteeId
exports.getMatchSuggestions = async (req, res) => {
  try {
    const suggestions = await getSuggestionsForMentee(req.params.menteeId);
    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/manual-match
exports.manualMatch = async (req, res) => {
  try {
    const { menteeId, mentorId } = req.body;
    const [mentee, mentor] = await Promise.all([User.findById(menteeId), User.findById(mentorId)]);
    if (!mentee || !mentor) return res.status(404).json({ message: 'User not found' });

    if (mentee.assignedMentor)
      await User.findByIdAndUpdate(mentee.assignedMentor, { $pull: { assignedMentees: menteeId } });

    await User.findByIdAndUpdate(menteeId,  { assignedMentor: mentorId, isMatched: true });
    await User.findByIdAndUpdate(mentorId,  { $addToSet: { assignedMentees: menteeId } });

    res.json({ success: true, message: `${mentee.name} matched with ${mentor.name}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/users
exports.createUser = async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email }))
      return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) delete req.body.password; // don't allow password update here
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('mentor','name email')
      .populate('mentee','name email')
      .sort({ date: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/need-analysis
exports.getAllNeedAnalysis = async (req, res) => {
  try {
    const forms = await NeedAnalysis.find()
      .populate('mentee','name email college year assignedMentor isMatched')
      .sort({ createdAt: -1 });
    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
