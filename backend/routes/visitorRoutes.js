const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  addVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor
} = require('../controllers/visitorController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// PUBLIC ROUTE
router.post(
  '/',
  upload.single('photo'),
  addVisitor
);

// PROTECTED ROUTES
router.get(
  '/',
  protect,
  authorize('Admin', 'Security', 'Host'),
  getVisitors
);

router.get(
  '/:id',
  protect,
  authorize('Admin', 'Security', 'Host'),
  getVisitorById
);

router.put(
  '/:id',
  protect,
  authorize('Admin', 'Security', 'Host'),
  upload.single('photo'),
  updateVisitor
);

router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Security'),
  deleteVisitor
);

module.exports = router;