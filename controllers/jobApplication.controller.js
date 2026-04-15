const { Op, Sequelize } = require("sequelize");
const { JobApplication, Company } = require("../models");

/**
 * CREATE JOB APPLICATION
 */
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      company_id,
      job_title,
      application_date,
      status,
      expected_salary,
      offered_salary,
      currency,
      notes
    } = req.body;

    if (!company_id || !job_title || !application_date) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const resumePath = req.file ? req.file.path : null;

    const application = await JobApplication.create({
      user_id: userId,
      company_id,
      job_title,
      application_date,
      status,
      expected_salary,
      offered_salary,
      currency,
      notes,
      resume_path: resumePath,
      is_archived: false
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("CREATE APPLICATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ACTIVE JOB APPLICATIONS
 */
exports.getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: {
        user_id: req.user.id,
        is_archived: false
      },
      include: [{ model: Company, required: false }],
      order: [["application_date", "DESC"]]
    });

    res.json(applications);
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ARCHIVED JOB APPLICATIONS
 */
exports.getArchivedApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: {
        user_id: req.user.id,
        is_archived: true
      },
      include: [{ model: Company, required: false }],
      order: [["updatedAt", "DESC"]]
    });

    res.json(applications);
  } catch (error) {
    console.error("GET ARCHIVED APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET SINGLE JOB APPLICATION
 */
exports.getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{ model: Company, required: false }]
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("GET APPLICATION BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE JOB APPLICATION
 */
exports.updateApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const {
      job_title,
      application_date,
      status,
      expected_salary,
      offered_salary,
      currency,
      notes,
      company_id
    } = req.body;

    Object.assign(application, {
      job_title: job_title ?? application.job_title,
      application_date: application_date ?? application.application_date,
      status: status ?? application.status,
      expected_salary: expected_salary ?? application.expected_salary,
      offered_salary: offered_salary ?? application.offered_salary,
      currency: currency ?? application.currency,
      notes: notes ?? application.notes,
      company_id: company_id ?? application.company_id
    });

    if (req.file) {
      application.resume_path = req.file.path;
    }

    await application.save();

    res.json({ message: "Application updated successfully", application });
  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * SEARCH APPLICATIONS (ACTIVE ONLY)
 */
exports.searchApplications = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const applications = await JobApplication.findAll({
      where: {
        user_id: req.user.id,
        is_archived: false,
        [Op.or]: [
          { job_title: { [Op.like]: `%${q}%` } },
          { status: { [Op.like]: `%${q}%` } },
          Sequelize.where(
            Sequelize.cast(Sequelize.col("expected_salary"), "CHAR"),
            { [Op.like]: `%${q}%` }
          ),
          Sequelize.where(
            Sequelize.cast(Sequelize.col("offered_salary"), "CHAR"),
            { [Op.like]: `%${q}%` }
          ),
          { "$Company.name$": { [Op.like]: `%${q}%` } }
        ]
      },
      include: [{ model: Company, required: false }],
      order: [["application_date", "DESC"]]
    });

    res.json(applications);
  } catch (error) {
    console.error("SEARCH APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * BULK UPDATE STATUS
 */
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No application IDs provided" });
    }

    await JobApplication.update(
      { status },
      { where: { id: ids, user_id: req.user.id } }
    );

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("BULK STATUS UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * BULK ARCHIVE (SOFT DELETE)
 */
exports.bulkArchive = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No application IDs provided" });
    }

    await JobApplication.update(
      { is_archived: true },
      { where: { id: ids, user_id: req.user.id } }
    );

    res.json({ message: "Jobs archived successfully" });
  } catch (error) {
    console.error("BULK ARCHIVE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * BULK RESTORE
 */
exports.bulkRestore = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No application IDs provided" });
    }

    await JobApplication.update(
      { is_archived: false },
      { where: { id: ids, user_id: req.user.id } }
    );

    res.json({ message: "Jobs restored successfully" });
  } catch (error) {
    console.error("BULK RESTORE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * BULK DELETE (PERMANENT)
 */
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No application IDs provided" });
    }

    await JobApplication.destroy({
      where: { id: ids, user_id: req.user.id }
    });

    res.json({ message: "Applications deleted permanently" });
  } catch (error) {
    console.error("BULK DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/jobApplication.controller.js
exports.unarchiveApplication = async (req, res) => {
  try {
    const app = await JobApplication.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        is_archived: true
      }
    });

    if (!app) {
      return res.status(404).json({ message: "Archived job not found" });
    }

    app.is_archived = false;
    await app.save();

    res.json({ message: "Job unarchived successfully" });
  } catch (err) {
    console.error("UNARCHIVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
