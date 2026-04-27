const { Attachment, JobApplication, Company } = require("../models");

/**
 * UPLOAD RESUME (PDF)
 * POST /api/attachments/resume/:applicationId
 */
exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    const attachment = await Attachment.create({
      user_id: userId,
      application_id: applicationId,
      file_name: req.file.originalname,
      file_path: req.file.path,
      mime_type: req.file.mimetype,
      file_type: "resume"
    });

    res.status(201).json(attachment);
  } catch (err) {
    console.error("UPLOAD RESUME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPLOAD COMPANY DOCUMENT
 * POST /api/attachments/company/:companyId
 */
exports.uploadCompanyDoc = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const attachment = await Attachment.create({
      user_id: userId,
      company_id: companyId,
      file_name: req.file.originalname,
      file_path: req.file.path,
      mime_type: req.file.mimetype,
      file_type: "company_doc"
    });

    res.status(201).json(attachment);
  } catch (err) {
    console.error("UPLOAD COMPANY DOC ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DOWNLOAD RESUME
 * GET /api/attachments/download/:id
 */
exports.downloadAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);

    if (!attachment) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(attachment.file_path, attachment.file_name);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
