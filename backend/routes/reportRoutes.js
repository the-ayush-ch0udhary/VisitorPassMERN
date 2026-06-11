const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const reportController = require('../controllers/reportController');

// Exporting visitor logs as CSV
router.get('/export/csv', protect, authorize('Admin', 'Security'), reportController.exportLogsCSV);

module.exports = router;