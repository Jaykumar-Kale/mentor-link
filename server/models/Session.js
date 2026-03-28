const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: {
    type: String,
    enum: [
      'Introduction Call',
      'Career Development',
      'Interpersonal Skills',
      'Communication Skills',
      'Etiquette',
      'Problem Solving and Decision Making',
      'Time and Stress Management',
      'Other',
    ],
    required: true,
  },
  date:        { type: Date, required: true },
  startTime:   { type: String, required: true },
  endTime:     { type: String },
  duration:    { type: String },
  meetingLink: { type: String },
  agenda:      { type: String },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  summary:        { type: String },
  mentorFeedback: { type: String },
  menteeFeedback: { type: String },
  menteeRating:   { type: Number, min: 1, max: 5 },
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
