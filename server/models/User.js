const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['admin', 'mentor', 'mentee', 'facilitator', 'alumni', 'donor'],
    required: true,
  },
  phone:         { type: String },
  gender:        { type: String, enum: ['Male', 'Female', 'Other'] },
  profilePhoto:  { type: String, default: '' },

  // Mentor fields
  organization:        { type: String },
  yearsOfExperience:   { type: Number },
  languagesKnown:      [{ type: String }],
  branch:              { type: String },
  expertise:           [{ type: String }],
  linkedIn:            { type: String },

  // Mentee fields
  college:      { type: String },
  year:         { type: String },
  stream:       { type: String },
  scholarshipId:{ type: String },

  // Matching
  assignedMentor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedMentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isMatched:       { type: Boolean, default: false },

  isActive:                { type: Boolean, default: true },
  needAnalysisCompleted:   { type: Boolean, default: false },
  ngoName:                 { type: String, default: 'Mudita Alliance' },

  passwordResetToken:  String,
  passwordResetExpire: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
