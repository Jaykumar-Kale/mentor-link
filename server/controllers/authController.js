const User     = require('../models/User');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, gender,
      organization, yearsOfExperience, languagesKnown, branch, expertise,
      college, year, stream, scholarshipId, linkedIn } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name, email, password,
      role: role || 'mentee',
      phone, gender,
      organization,
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
      languagesKnown: languagesKnown
        ? (Array.isArray(languagesKnown) ? languagesKnown : languagesKnown.split(',').map(l => l.trim()))
        : [],
      branch,
      expertise: expertise
        ? (Array.isArray(expertise) ? expertise : expertise.split(',').map(e => e.trim()))
        : [],
      college, year, stream, scholarshipId, linkedIn,
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to MentorLink – Mudita Alliance',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#3730a3;padding:24px;text-align:center">
            <h1 style="color:#fff;margin:0">Welcome to MentorLink</h1>
            <p style="color:#c7d2fe;margin:4px 0 0">Mudita – An Alliance for Giving</p>
          </div>
          <div style="padding:24px;background:#f9fafb">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your account has been created successfully.</p>
            <table style="margin:12px 0;font-size:14px">
              <tr><td style="padding:4px 8px;background:#e0e7ff">Role</td><td style="padding:4px 8px">${role}</td></tr>
              <tr><td style="padding:4px 8px;background:#e0e7ff">Email</td><td style="padding:4px 8px">${email}</td></tr>
            </table>
            <a href="${process.env.CLIENT_URL}/login"
               style="display:inline-block;background:#f59e0b;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
              Login to MentorLink
            </a>
            <p style="margin-top:16px;color:#6b7280;font-size:13px">
              Questions? Email <a href="mailto:mentoring@muditaalliance.org">mentoring@muditaalliance.org</a>
            </p>
          </div>
        </div>`,
      });
    } catch (e) {
      console.log('Welcome email failed (non-fatal):', e.message);
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email,
              role: user.role, profilePhoto: user.profilePhoto },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account deactivated. Contact admin.' });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, profilePhoto: user.profilePhoto,
        isMatched: user.isMatched,
        needAnalysisCompleted: user.needAnalysisCompleted,
        assignedMentor: user.assignedMentor,
        assignedMentees: user.assignedMentees,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
      .populate('assignedMentor', 'name email profilePhoto organization phone languagesKnown expertise')
      .populate('assignedMentees', 'name email profilePhoto college year');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: 'MentorLink – Password Reset',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#3730a3;padding:20px;text-align:center">
          <h2 style="color:#fff;margin:0">Password Reset</h2>
        </div>
        <div style="padding:24px">
          <p>Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
          <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}"
             style="display:inline-block;background:#f59e0b;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
            Reset Password
          </a>
          <p style="margin-top:16px;color:#6b7280;font-size:13px">If you did not request this, ignore this email.</p>
        </div>
      </div>`,
    });
    res.json({ success: true, message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user   = await User.findOne({
      passwordResetToken:  hashed,
      passwordResetExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password            = req.body.password;
    user.passwordResetToken  = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const fields = ['name','phone','organization','languagesKnown',
                    'branch','college','year','stream','linkedIn','expertise'];
    const update = {};
    fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
