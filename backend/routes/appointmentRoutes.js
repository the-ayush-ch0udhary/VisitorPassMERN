const express = require('express');
const router = express.Router();

const {
    createAppointment,
    getAppointments,
    approveAppointment,
    rejectAppointment
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public route
router.post('/', createAppointment);

// Protected routes
router.get('/', protect, getAppointments);

router.put(
    '/:id/approve',
    protect,
    authorize('Admin', 'Host', 'Security'),
    approveAppointment
);

router.put(
    '/:id/reject',
    protect,
    authorize('Admin', 'Host', 'Security'),
    rejectAppointment
);

module.exports = router;