const mongoose = require('mongoose');

const ScholarshipApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  college: String,
  phone: String,
  year: String,
  field: String,
  cgpa: String,
  whyDeserving: { type: String, required: true },
  familyBackground: String,
  financialNeed: String,
  achievements: String,
  documents: [String],
  status: { type: String, enum: ['submitted', 'under_review', 'accepted', 'rejected'], default: 'submitted' },
  appliedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScholarshipApplication', ScholarshipApplicationSchema);
