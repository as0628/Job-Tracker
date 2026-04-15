const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  uploadResume,
  uploadCompanyDoc,
  downloadAttachment
} = require("../controllers/attachment.controller");

const {
  uploadResume: resumeUpload,
  uploadCompanyDoc: companyUpload
} = require("../utils/upload");

// =======================
// RESUME UPLOAD (PDF)
// =======================
router.post(
  "/attachments/resume/:applicationId",
  auth,
  resumeUpload.single("file"),
  uploadResume
);

// =======================
// COMPANY DOCUMENT UPLOAD
// =======================
router.post(
  "/attachments/company/:companyId",
  auth,
  companyUpload.single("file"),
  uploadCompanyDoc
);

// =======================
// DOWNLOAD FILE (resume only)
// =======================
router.get(
  "/attachments/download/:id",
  auth,
  downloadAttachment
);

module.exports = router;
