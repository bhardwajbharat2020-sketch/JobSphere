const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { parseResume } = require('../services/resumeParser');
const { parseResumePDF } = require('../services/resumePDFParser');
const { calculateCandidateCompleteness } = require('../services/profileCompleteness');
const fs = require('fs');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;

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

  const users = await User.find(query).select('-password');

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check authorization
  if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }

  const { name, profile } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      ...(name && { name }),
      ...(profile && { profile }),
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedUser,
  });
});

// @desc    Upload and parse resume
// @route   POST /api/users/:id/resume
// @access  Private
exports.uploadResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  let resumeUrl = user.profile?.resumeUrl || '';
  let parsedData = {};

  // If PDF file is uploaded
  if (req.file) {
    try {
      // Parse PDF to extract structured data
      const pdfBuffer = fs.readFileSync(req.file.path);
      parsedData = await parseResumePDF(pdfBuffer);

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      if (parsedData.success) {
        // Upload to Cloudinary (if configured)
        // For now, store parsed data directly
        resumeUrl = `/uploads/${req.file.filename}`;
      }
    } catch (error) {
      console.error('Error processing resume:', error);
    }
  } else if (req.body.resumeUrl) {
    // If resume URL is provided
    resumeUrl = req.body.resumeUrl;
    const resumeText = req.body.resumeText || '';
    parsedData = parseResume(resumeText);
  } else {
    res.status(400);
    throw new Error('Please provide resume file or URL');
  }

  // Update user profile with parsed data
  const updatedProfile = {
    ...user.profile,
    resumeUrl,
    resumeParsed: parsedData.success || false,
    parsedSkills: parsedData.skills || user.profile?.parsedSkills || [],
    parsedEducation: parsedData.education || user.profile?.parsedEducation || '',
    parsedExperience: parsedData.experience || user.profile?.parsedExperience || '',
  };

  // Merge parsed skills with existing skills (avoid duplicates)
  if (parsedData.skills && parsedData.skills.length > 0) {
    const existingSkills = user.profile?.skills || [];
    const mergedSkills = [...new Set([...existingSkills, ...parsedData.skills])];
    updatedProfile.skills = mergedSkills;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { profile: updatedProfile },
    { new: true, runValidators: true }
  );

  // Calculate profile completeness
  const completeness = calculateCandidateCompleteness(updatedUser);
  updatedUser.profile.completenessScore = completeness.score;
  await updatedUser.save();

  res.json({
    success: true,
    data: updatedUser,
    parsed: parsedData,
    completeness,
  });
});

// @desc    Approve recruiter (admin only)
// @route   PATCH /api/users/:id/approve
// @access  Private/Admin
exports.approveRecruiter = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'recruiter') {
    res.status(400);
    throw new Error('Can only approve recruiters');
  }

  user.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : true;
  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Get profile completeness
// @route   GET /api/users/:id/completeness
// @access  Private
exports.getProfileCompleteness = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { calculateCandidateCompleteness, calculateRecruiterCompleteness } = require('../services/profileCompleteness');
  
  let completeness;
  if (user.role === 'candidate') {
    completeness = calculateCandidateCompleteness(user);
  } else if (user.role === 'recruiter') {
    completeness = calculateRecruiterCompleteness(user);
  } else {
    completeness = { score: 100, suggestions: [], breakdown: {} };
  }

  // Update user's completeness score
  if (user.profile) {
    user.profile.completenessScore = completeness.score;
    await user.save();
  }

  res.json({
    success: true,
    data: completeness,
  });
});
