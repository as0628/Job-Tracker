const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const jobApplicationController = require("../controllers/jobApplication.controller");
const { uploadResume } = require("../utils/upload");

/**
 * SEARCH (must be before :id)
 */
router.get(
  "/search",
  authMiddleware,
  jobApplicationController.searchApplications
);

/**
 * CREATE APPLICATION (WITH RESUME)
 */
router.post(
  "/",
  authMiddleware,
  uploadResume.single("resume"),
  jobApplicationController.createApplication
);

/**
 * GET ACTIVE APPLICATIONS
 */
router.get(
  "/",
  authMiddleware,
  jobApplicationController.getApplications
);

/**
 * GET ARCHIVED APPLICATIONS
 */
router.get(
  "/archived",
  authMiddleware,
  jobApplicationController.getArchivedApplications
);

/**
 * GET SINGLE APPLICATION
 */
router.get(
  "/:id",
  authMiddleware,
  jobApplicationController.getApplicationById
);

/**
 * UPDATE APPLICATION (resume optional)
 */
router.put(
  "/:id",
  authMiddleware,
  uploadResume.single("resume"),
  jobApplicationController.updateApplication
);

/**
 * BULK UPDATE STATUS
 */
router.put(
  "/bulk/status",
  authMiddleware,
  jobApplicationController.bulkUpdateStatus
);

/**
 * BULK ARCHIVE (SOFT DELETE)
 */
router.put(
  "/bulk/archive",
  authMiddleware,
  jobApplicationController.bulkArchive
);

/**
 * BULK RESTORE (FROM ARCHIVE)
 */
router.put(
  "/bulk/restore",
  authMiddleware,
  jobApplicationController.bulkRestore
);

/**
 * BULK DELETE (PERMANENT)
 */
router.post(
  "/bulk/delete",
  authMiddleware,
  jobApplicationController.bulkDelete
);

// routes/jobApplication.routes.js
router.put(
  "/:id/unarchive",
  authMiddleware,
  jobApplicationController.unarchiveApplication
);


module.exports = router;
