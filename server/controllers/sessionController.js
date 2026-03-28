const Session = require('../models/Session');
const User    = require('../models/User');

// POST /api/sessions
exports.createSession = async (req, res) => {
  try {
    const { topic, date, startTime, duration, meetingLink, agenda, menteeId } = req.body;

    // Calculate end time from start + duration
    let endTime = '';
    if (startTime && duration) {
      const [h, m]  = startTime.split(':').map(Number);
      const total   = h * 60 + m + Number(duration);
      endTime       = `${String(Math.floor(total / 60) % 24).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
    }

    let mentorId, finalMenteeId;
    if (req.user.role === 'mentee') {
      finalMenteeId = req.user._id;
      const me = await User.findById(req.user._id);
      mentorId = me.assignedMentor;
      if (!mentorId) return res.status(400).json({ message: 'You are not assigned a mentor yet.' });
    } else {
      mentorId      = req.user._id;
      finalMenteeId = menteeId;
      if (!finalMenteeId) return res.status(400).json({ message: 'menteeId required' });
    }

    const session = await Session.create({
      mentor: mentorId, mentee: finalMenteeId,
      topic, date, startTime, endTime, duration,
      meetingLink, agenda, createdBy: req.user._id,
    });

    const populated = await Session.findById(session._id)
      .populate('mentor','name email profilePhoto')
      .populate('mentee','name email profilePhoto');

    res.status(201).json({ success: true, session: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/sessions
exports.getMySessions = async (req, res) => {
  try {
    const q = req.user.role === 'mentee' ? { mentee: req.user._id }
            : req.user.role === 'mentor' ? { mentor: req.user._id }
            : {};
    const sessions = await Session.find(q)
      .populate('mentor','name email profilePhoto organization')
      .populate('mentee','name email profilePhoto college')
      .sort({ date: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/sessions/stats
exports.getSessionStats = async (req, res) => {
  try {
    const q = req.user.role === 'mentee' ? { mentee: req.user._id } : { mentor: req.user._id };
    const [total, completed, upcoming, cancelled] = await Promise.all([
      Session.countDocuments(q),
      Session.countDocuments({ ...q, status: 'completed' }),
      Session.countDocuments({ ...q, status: 'upcoming' }),
      Session.countDocuments({ ...q, status: 'cancelled' }),
    ]);
    const progress = Math.min(Math.round((completed / 8) * 100), 100);
    const done     = await Session.find({ ...q, status: 'completed' }).select('topic');
    const completedTopics = [...new Set(done.map(s => s.topic))];
    res.json({ success: true, stats: { total, completed, upcoming, cancelled, progress, completedTopics } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/sessions/:id/status
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status, summary, mentorFeedback, menteeFeedback, menteeRating } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isOwner = session.mentor.toString() === req.user._id.toString()
                 || session.mentee.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Not authorized' });

    if (status)        session.status        = status;
    if (summary)       session.summary       = summary;
    if (mentorFeedback) session.mentorFeedback = mentorFeedback;
    if (menteeFeedback) session.menteeFeedback = menteeFeedback;
    if (menteeRating)  session.menteeRating  = menteeRating;
    await session.save();

    const updated = await Session.findById(session._id)
      .populate('mentor','name email profilePhoto')
      .populate('mentee','name email profilePhoto');
    res.json({ success: true, session: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/sessions/:id
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('mentor','name email')
      .populate('mentee','name email');
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/sessions/:id
exports.deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
