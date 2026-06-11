const express = require('express');
const router = express.Router();

const { createOrg, getOrgs } = require('../controllers/orgController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Organization management routes
router.get('/', getOrgs );

router.post('/', createOrg);
module.exports = router;