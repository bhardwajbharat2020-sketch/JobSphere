const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  salary: {
    min: { type: Number, required: [true, 'Please add minimum salary'] },
    max: { type: Number, required: [true, 'Please add maximum salary'] },
  },
  skills: [{
    type: String,
    required: true,
  }],
  location: {
    type: String,
    required: [true, 'Please add a location'],
    index: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote'],
    default: 'full-time',
  },
  experience: {
    type: String,
    required: [true, 'Please add experience requirement'],
  },
  jobLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'manager'],
    default: 'entry',
  },
  department: String,
  remote: { type: Boolean, default: false },
  benefits: [{ type: String }],
  applicationDeadline: Date,
  views: { type: Number, default: 0 },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for text search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, jobType: 1, jobLevel: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
