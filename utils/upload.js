const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===============================
// ENSURE UPLOAD DIRECTORIES EXIST
// ===============================
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir("uploads");
ensureDir("uploads/resumes");
ensureDir("uploads/company_docs");

// ===============================
// RESUME STORAGE (PDF ONLY)
// ===============================
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName =
      "resume-" + Date.now() + ext;
    cb(null, safeName);
  }
});

// ===============================
// COMPANY DOCUMENT STORAGE
// ===============================
const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/company_docs");
  },
  filename: (req, file, cb) => {
    const safeName =
      "company-" + Date.now() + "-" + file.originalname;
    cb(null, safeName);
  }
});

// ===============================
// RESUME UPLOAD (PDF ONLY)
// ===============================
const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Only PDF files are allowed for resumes"),
        false
      );
    }
    cb(null, true);
  }
});

// ===============================
// COMPANY DOC UPLOAD (ANY FILE)
// ===============================
const uploadCompanyDoc = multer({
  storage: companyStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// ===============================
// EXPORTS
// ===============================
module.exports = {
  uploadResume,
  uploadCompanyDoc
};
