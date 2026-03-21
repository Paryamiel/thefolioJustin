// backend/middleware/upload.js
const multer = require('multer');
const fs = require('fs');

// Create the uploads folder automatically if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        // Give the file a unique name using the current timestamp
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

module.exports = multer({ storage });