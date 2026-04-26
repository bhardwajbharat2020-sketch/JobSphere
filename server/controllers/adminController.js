const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCandidates = await User.countDocuments({ role: 'candidate' });
  const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
  const pendingApprovals = await User.countDocuments({ role: 'recruiter', isApproved: false });
  
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ isActive: true });
  
  const totalApplications = await Application.countDocuments();
  const appliedCount = await Application.countDocuments({ status: 'applied' });
  const shortlistedCount = await Application.countDocuments({ status: 'shortlisted' });
  const rejectedCount = await Application.countDocuments({ status: 'rejected' });

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        candidates: totalCandidates,
        recruiters: totalRecruiters,
        pendingApprovals,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
      },
      applications: {
        total: totalApplications,
        applied: appliedCount,
        shortlisted: shortlistedCount,
        rejected: rejectedCount,
      },
    },
  });
});

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  let query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getAllJobs = asyncHandler(async (req, res) => {
  const { isActive, page = 1, limit = 20 } = req.query;

  let query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
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

// @desc    Toggle user ban status
// @route   PATCH /api/admin/users/:id/ban
// @access  Private/Admin
exports.toggleUserBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Cannot ban admin users');
  }

  user.isApproved = !user.isApproved;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isApproved ? 'approved' : 'banned'} successfully`,
    data: user,
  });
});
