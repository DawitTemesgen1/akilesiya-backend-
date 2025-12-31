const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the absolute path to the root 'public' directory
const publicDir = path.join(__dirname, '..', 'public');
// Define the absolute path to the 'uploads' directory inside 'public'
const uploadPath = path.join(publicDir, 'uploads');

// Ensure the base 'public/uploads' directory exists on server start
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`✅ Created directory for uploads at: ${uploadPath}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use the guaranteed existing path
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userIdentifier = req.user ? req.user.id : 'guest';
        const uniqueSuffix = `${userIdentifier}-${Date.now()}`;
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType || extName) { // Be more flexible for web uploads
        return cb(null, true);
    }
    cb(new Error('File upload only supports the following filetypes: ' + allowedTypes), false);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: fileFilter
});

module.exports = { upload };