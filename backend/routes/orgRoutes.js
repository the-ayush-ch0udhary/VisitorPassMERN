const express = require('express');
const router = express.Router();
const { createOrg, getOrgs } = require('../controllers/orgController');

// Routes for organization setup and fetching
router.post('/', createOrg);
router.get('/', getOrgs);

module.exports = router;
