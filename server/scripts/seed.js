const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const connectDB = require('../config/db');

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@jobportal.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true,
      isVerified: true, // Demo user - no OTP needed
    });

    // Create Recruiters
    const recruiters = await User.create([
      {
        name: 'John Smith',
        email: 'recruiter1@techcorp.com',
        password: 'recruiter123',
        role: 'recruiter',
        isApproved: true,
        isVerified: true, // Demo user - no OTP needed
      },
      {
        name: 'Sarah Johnson',
        email: 'recruiter2@innovate.com',
        password: 'recruiter123',
        role: 'recruiter',
        isApproved: true,
        isVerified: true, // Demo user - no OTP needed
      },
      {
        name: 'Mike Davis',
        email: 'recruiter3@startup.com',
        password: 'recruiter123',
        role: 'recruiter',
        isApproved: false, // Pending approval
        isVerified: true, // Demo user - no OTP needed
      },
    ]);

    // Create Candidates
    const candidates = await User.create([
      {
        name: 'Alice Williams',
        email: 'candidate1@email.com',
        password: 'candidate123',
        role: 'candidate',
        isVerified: true, // Demo user - no OTP needed
        profile: {
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          parsedSkills: ['JavaScript', 'React', 'Node.js'],
        },
      },
      {
        name: 'Bob Brown',
        email: 'candidate2@email.com',
        password: 'candidate123',
        role: 'candidate',
        isVerified: true, // Demo user - no OTP needed
        profile: {
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          parsedSkills: ['Python', 'Django', 'PostgreSQL'],
        },
      },
      {
        name: 'Charlie Davis',
        email: 'candidate3@email.com',
        password: 'candidate123',
        role: 'candidate',
        isVerified: true, // Demo user - no OTP needed
        profile: {
          skills: ['Java', 'Spring Boot', 'AWS', 'MySQL'],
          parsedSkills: ['Java', 'Spring Boot', 'AWS'],
        },
      },
    ]);

    console.log('Created users');

    // Create Jobs
    const jobs = await Job.create([
      {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our team. You will be responsible for building and maintaining web applications.\n\nResponsibilities:\n- Develop new user-facing features\n- Build reusable components\n- Optimize application performance\n\nRequirements:\n- 3+ years of React experience\n- Strong JavaScript skills\n- Experience with state management',
        company: 'TechCorp',
        salary: { min: 80000, max: 120000 },
        skills: ['React', 'JavaScript', 'Redux', 'CSS'],
        location: 'New York, NY',
        jobType: 'full-time',
        experience: '3-5 years',
        recruiterId: recruiters[0]._id,
      },
      {
        title: 'Full Stack Developer',
        description: 'Join our innovative team as a Full Stack Developer. You will work on both frontend and backend development.\n\nTechnologies: React, Node.js, MongoDB, AWS',
        company: 'Innovate Inc',
        salary: { min: 90000, max: 130000 },
        skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experience: '2-4 years',
        recruiterId: recruiters[1]._id,
      },
      {
        title: 'Backend Developer',
        description: 'We need a skilled backend developer to build robust APIs and services.',
        company: 'StartupXYZ',
        salary: { min: 70000, max: 100000 },
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
        location: 'Remote',
        jobType: 'remote',
        experience: '2-3 years',
        recruiterId: recruiters[0]._id,
      },
      {
        title: 'Python Developer',
        description: 'Looking for a Python developer with Django experience.',
        company: 'DataTech',
        salary: { min: 85000, max: 115000 },
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experience: '3+ years',
        recruiterId: recruiters[1]._id,
      },
      {
        title: 'Frontend Developer',
        description: 'Create beautiful and responsive user interfaces.',
        company: 'DesignCo',
        salary: { min: 65000, max: 90000 },
        skills: ['React', 'CSS', 'HTML', 'JavaScript'],
        location: 'Chicago, IL',
        jobType: 'full-time',
        experience: '1-3 years',
        recruiterId: recruiters[0]._id,
      },
    ]);

    console.log('Created jobs');

    // Create Applications
    await Application.create([
      {
        jobId: jobs[0]._id,
        candidateId: candidates[0]._id,
        status: 'applied',
        coverLetter: 'I am very interested in this position and believe my skills match perfectly.',
      },
      {
        jobId: jobs[1]._id,
        candidateId: candidates[0]._id,
        status: 'shortlisted',
        coverLetter: 'Excited to apply for this full-stack role!',
      },
      {
        jobId: jobs[2]._id,
        candidateId: candidates[1]._id,
        status: 'applied',
      },
      {
        jobId: jobs[3]._id,
        candidateId: candidates[1]._id,
        status: 'rejected',
      },
      {
        jobId: jobs[0]._id,
        candidateId: candidates[2]._id,
        status: 'applied',
      },
    ]);

    console.log('Created applications');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('================================');
    console.log('Admin:');
    console.log('  Email: admin@jobportal.com');
    console.log('  Password: admin123');
    console.log('\nRecruiter 1 (Approved):');
    console.log('  Email: recruiter1@techcorp.com');
    console.log('  Password: recruiter123');
    console.log('\nRecruiter 2 (Approved):');
    console.log('  Email: recruiter2@innovate.com');
    console.log('  Password: recruiter123');
    console.log('\nRecruiter 3 (Pending Approval):');
    console.log('  Email: recruiter3@startup.com');
    console.log('  Password: recruiter123');
    console.log('\nCandidate 1:');
    console.log('  Email: candidate1@email.com');
    console.log('  Password: candidate123');
    console.log('\nCandidate 2:');
    console.log('  Email: candidate2@email.com');
    console.log('  Password: candidate123');
    console.log('\nCandidate 3:');
    console.log('  Email: candidate3@email.com');
    console.log('  Password: candidate123');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
