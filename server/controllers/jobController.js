const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const { recommendJobs } = require('../services/jobRecommender');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
  const { keyword, location, skills, minSalary, maxSalary, jobType, page = 1, limit = 10 } = req.query;

  let query = { isActive: true };

  // Keyword search (title, description)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Location filter
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  // Skills filter
  if (skills) {
    const skillArray = skills.split(',');
    query.skills = { $in: skillArray };
  }

  // Salary filter
  if (minSalary) {
    query['salary.max'] = { $gte: parseInt(minSalary) };
  }
  if (maxSalary) {
    query['salary.min'] = { $lte: parseInt(maxSalary) };
  }

  // Job type filter
  if (jobType) {
    query.jobType = jobType;
  }

  const skip = (page - 1) * limit;

  const jobs = await Job.find(query)
    .populate('recruiterId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Job.countDocuments(query);

  res.json({
    success: true,
    count: jobs.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('recruiterId', 'name email');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.json({
    success: true,
    data: job,
  });
});

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Recruiter
exports.createJob = asyncHandler(async (req, res) => {
  const { title, description, company, salary, skills, location, jobType, experience } = req.body;

  const job = await Job.create({
    title,
    description,
    company,
    salary,
    skills,
    location,
    jobType,
    experience,
    recruiterId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: job,
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter
exports.updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check ownership
  if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: job,
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter/Admin
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check ownership
  if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});

// @desc    Get recommended jobs
// @route   GET /api/jobs/recommended
// @access  Private/Candidate
exports.getRecommendedJobs = asyncHandler(async (req, res) => {
  const candidate = req.user;
  const jobs = await Job.find({ isActive: true });

  const recommended = recommendJobs(candidate, jobs);

  res.json({
    success: true,
    count: recommended.length,
    data: recommended,
  });
});

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private/Recruiter
exports.getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiterId: req.user._id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});
