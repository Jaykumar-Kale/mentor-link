const mongoose = require('mongoose');

const needAnalysisSchema = new mongoose.Schema({
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  expectations:  { type: String, maxlength: 500 },
  ratings: {
    careerDevelopment:  { type: Number, min: 1, max: 5 },
    interpersonalSkills:{ type: Number, min: 1, max: 5 },
    communicationSkills:{ type: Number, min: 1, max: 5 },
    etiquette:          { type: Number, min: 1, max: 5 },
    problemSolving:     { type: Number, min: 1, max: 5 },
    timeManagement:     { type: Number, min: 1, max: 5 },
  },
  willMentorshipHelp: { type: String },
  specificNeeds:      { type: String, maxlength: 500 },
  willingToContact:   { type: String },
  preferredLanguage:  [{ type: String }],
  submittedAt:        { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('NeedAnalysis', needAnalysisSchema);
