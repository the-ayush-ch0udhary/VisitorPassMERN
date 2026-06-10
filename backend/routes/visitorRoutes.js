const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addVisitor, getVisitors, getVisitorById, updateVisitor, deleteVisitor } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

// Configure disk storage for Multer uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Uploads will be stored in the 'uploads/' folder
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to ensure only image formats are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer middleware
const upload = multer({ storage, fileFilter });

// Routes mappings (secured via JWT verification middleware)
router.post('/', protect, upload.single('photo'), addVisitor);
router.get('/', protect, getVisitors);
router.get('/:id', protect, getVisitorById);
router.put('/:id', protect, upload.single('photo'), updateVisitor);
router.delete('/:id', protect, deleteVisitor);

module.exports = router;
