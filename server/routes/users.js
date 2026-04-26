const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getUsers, updateProfile, uploadResume, approveRecruiter, getProfileCompleteness } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id/completeness', protect, getProfileCompleteness);
router.put('/:id', protect, updateProfile);
router.post('/:id/resume', protect, upload.single('resume'), uploadResume);
router.patch('/:id/approve', protect, authorize('admin'), approveRecruiter);

module.exports = router;
