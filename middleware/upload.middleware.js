const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (!ext) {
    return cb(new Error("Only PDF/DOC files allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
