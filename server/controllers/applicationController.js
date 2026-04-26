const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendApplicationNotification, sendStatusUpdateNotification } = require('../services/emailService');

// @desc    Apply to job
// @route   POST /api/applications/apply/:jobId
// @access  Private/Candidate
exports.applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (!job.isActive) {
    res.status(400);
    throw new Error('Job is no longer active');
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    jobId: req.params.jobId,
    candidateId: req.user._id,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied to this job');
  }

  const { coverLetter } = req.body;

  const application = await Application.create({
    jobId: req.params.jobId,
    candidateId: req.user._id,
    coverLetter,
  });

  // Update job applications count
  job.applicationsCount += 1;
  await job.save();

  // Send email notification to recruiter
  const recruiter = await User.findById(job.recruiterId);
  if (recruiter) {
    await sendApplicationNotification(recruiter.email, req.user.name, job.title);
  }

  res.status(201).json({
    success: true,
    data: application,
  });
});

// @desc    Get applications
// @route   GET /api/applications
// @access  Private
exports.getApplications = asyncHandler(async (req, res) => {
  let query = {};

  // Candidates see their own applications
  if (req.user.role === 'candidate') {
    query.candidateId = req.user._id;
  }
  // Recruiters see applications for their jobs
  else if (req.user.role === 'recruiter') {
    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map(job => job._id);
    query.jobId = { $in: jobIds };
  }
  // Admins see all applications
  // (query remains empty)

  const applications = await Application.find(query)
    .populate('jobId', 'title company location')
    .populate('candidateId', 'name email profile');

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private/Recruiter
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['shortlisted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const application = await Application.findById(req.params.id)
    .populate('jobId')
    .populate('candidateId');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Verify recruiter owns this job
  const job = await Job.findById(application.jobId._id);
  if (job.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  application.status = status;
  await application.save();

  // Send email notification to candidate
  await sendStatusUpdateNotification(
    application.candidateId.email,
    application.candidateId.name,
    application.jobId.title,
    status
  );

  res.json({
    success: true,
    data: application,
  });
});

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
exports.getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Verify recruiter owns this job
  if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const applications = await Application.find({ jobId: req.params.jobId })
    .populate('candidateId', 'name email profile')
    .sort({ appliedAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private/Candidate
exports.withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Verify candidate owns this application
  if (application.candidateId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Can only withdraw if status is 'applied'
  if (application.status !== 'applied') {
    res.status(400);
    throw new Error('Can only withdraw applications that are pending');
  }

  await application.deleteOne();

  // Decrement job applications count
  const job = await Job.findById(application.jobId);
  if (job) {
    job.applicationsCount = Math.max(0, job.applicationsCount - 1);
    await job.save();
  }

  res.json({
    success: true,
    message: 'Application withdrawn successfully',
  });
});
