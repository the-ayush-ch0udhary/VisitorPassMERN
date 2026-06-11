const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getMe,
    getHosts
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Used for appointment booking host dropdown
router.get('/hosts', protect, getHosts);

module.exports = router;