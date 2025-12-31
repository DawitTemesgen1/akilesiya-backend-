const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <-- ADD THIS LINE to access the file system
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ==========================================================
// --- THIS IS THE CRITICAL FIX ---
// 1. Define the absolute path for our uploads directory.
const uploadPath = path.join(__dirname, '..', 'public', 'uploads');

// 2. Check if the directory exists.
if (!fs.existsSync(uploadPath)) {
  // If it doesn't exist, create it recursively.
  // The `{ recursive: true }` option will create both 'public' and 'uploads' if needed.
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`✅ Created directory for uploads at: ${uploadPath}`);
}
// ==========================================================

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Now we can safely use the uploadPath because we know it exists.
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    let ext = MIME_TYPE_MAP[file.mimetype];
    if (!ext) {
      ext = path.extname(file.originalname).split('.').pop();
    }
    if (!['png', 'jpeg', 'jpg'].includes(ext)) {
       return cb(new Error('Invalid file type'));
    }
    cb(null, `${path.parse(name).name}-${Date.now()}.${ext}`);
  },
});

// --- Multer Configuration ---
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isMimeTypeValid = !!MIME_TYPE_MAP[file.mimetype];
    const isExtensionValid = /jpg|jpeg|png/.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeValid || isExtensionValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only JPG, JPEG, and PNG are allowed.'), false);
    }
  },
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, (req, res, next) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      console.error('--- UPLOAD ERROR ---', err);
      return res.status(500).json({ success: false, message: 'Server error during file upload.' });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file was uploaded.' });
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    url: url,
  });
});

module.exports = router;