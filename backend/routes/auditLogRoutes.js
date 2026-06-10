const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditLogController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Audit logs are highly sensitive; restrict strictly to Admin role
router.get('/', protect, authorize('Admin'), getAuditLogs);

module.exports = router;
