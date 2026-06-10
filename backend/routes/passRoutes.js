const express = require('express');
const router = express.Router();
const { getPasses, getPassById } = require('../controllers/passController');
const { protect } = require('../middleware/authMiddleware');

// Route protection middleware
router.use(protect);

router.get('/', getPasses);
router.get('/:id', getPassById);

module.exports = router;
