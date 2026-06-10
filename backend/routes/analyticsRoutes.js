const express = require('express');
const router = express.Router();
const { getStats, getTrends } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Analytical data is restricted to Admin role
router.get('/stats', protect, authorize('Admin'), getStats);
router.get('/trends', protect, authorize('Admin'), getTrends);

module.exports = router;
