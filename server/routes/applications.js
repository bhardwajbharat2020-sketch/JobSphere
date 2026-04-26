const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getApplications,
  updateApplicationStatus,
  getJobApplicants,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/apply/:jobId', protect, authorize('candidate'), applyToJob);
router.get('/', protect, getApplications);
router.patch('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.delete('/:id', protect, authorize('candidate'), withdrawApplication);

module.exports = router;
