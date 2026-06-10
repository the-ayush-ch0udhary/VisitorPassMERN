const express = require('express');
const router = express.Router();
const { register, login, getMe, getHosts } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', register);
router.post('/login', login);

// Protected endpoints (requires valid JWT token)
router.get('/me', protect, getMe);
router.get('/hosts', getHosts); // Public or protected; keep public for visitor booking dropdown

module.exports = router;
