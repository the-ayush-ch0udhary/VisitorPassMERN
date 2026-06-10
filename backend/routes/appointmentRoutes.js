const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, approveAppointment, rejectAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Secure all routes with JWT validation
router.use(protect);

router.post('/', createAppointment);
router.get('/', getAppointments);

// Endpoints for host approvals/rejections (restricted to Admin, Host, and Security guards)
router.put('/:id/approve', authorize('Admin', 'Host', 'Security'), approveAppointment);
router.put('/:id/reject', authorize('Admin', 'Host', 'Security'), rejectAppointment);

module.exports = router;
