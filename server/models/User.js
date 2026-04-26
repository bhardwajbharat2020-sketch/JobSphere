const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate',
  },
  profile: {
    // Personal Info
    avatar: String,
    headline: String,
    location: String,
    bio: String,
    
    // Professional
    skills: [{ type: String }],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
    }],
    education: [{
      degree: String,
      institution: String,
      field: String,
      startYear: Number,
      endYear: Number,
      grade: String,
    }],
    projects: [{
      name: String,
      description: String,
      techStack: [String],
      link: String,
      image: String,
    }],
    certifications: [{
      name: String,
      issuingOrganization: String,
      issueDate: Date,
      expirationDate: Date,
      credentialId: String,
      credentialURL: String,
    }],
    
    // Resume
    resumeUrl: String,
    resumeParsed: { type: Boolean, default: false },
    parsedSkills: [{ type: String }],
    parsedEducation: String,
    parsedExperience: String,
    
    // Social Links
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String,
    
    // Profile completeness
    completenessScore: { type: Number, default: 0 },
  },
  
  // Company info for recruiters
  company: {
    name: String,
    logo: String,
    industry: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    website: String,
    location: String,
    description: String,
    founded: Number,
  },
  contactInfo: {
    phone: String,
    alternateEmail: String,
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'admin';
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpCode: String,
  otpExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
