const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllJobs, toggleUserBan } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/jobs', protect, authorize('admin'), getAllJobs);
router.patch('/users/:id/ban', protect, authorize('admin'), toggleUserBan);

module.exports = router;
