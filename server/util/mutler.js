const multer = require("multer");
const path = require("path");

// Multer config
// Check for incoming file extensions to be only passing .jpg, .jpeg, or .png
module.exports = multer({
  storage: multer.diskStorage({}),
  limits: {
    files: 1,                // Allow only 1 file per request
    fileSize: 3 * (1024 * 1024)    // 3 MB (max file size)
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});