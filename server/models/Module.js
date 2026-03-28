const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  fileName:   String,
  fileUrl:    String,
  fileType:   { type: String, enum: ['pdf','ppt','pptx','doc','docx','video','other'] },
  uploadedAt: { type: Date, default: Date.now },
});

const moduleSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  order:       { type: Number, default: 0 },
  coverImage:  { type: String, default: '' },
  resources:   [resourceSchema],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
