const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Export check logs as CSV
router.get('/export/csv', auth, reportController.exportLogsCSV);

module.exports = router;