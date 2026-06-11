const express = require('express');
const router = express.Router();

const {
    checkIn,
    checkOut,
    getCheckLogs
} = require('../controllers/checkLogController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Route protections
router.use(protect);

// Security actions
router.post(
    '/check-in',
    authorize('Admin', 'Security'),
    checkIn
);

router.post(
    '/check-out',
    authorize('Admin', 'Security'),
    checkOut
);

// View logs action
router.get(
    '/',
    authorize('Admin', 'Security', 'Host'),
    getCheckLogs
);

module.exports = router;