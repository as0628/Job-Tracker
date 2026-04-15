const { JobApplication, Company,User } = require("../models");
const { Sequelize } = require("sequelize");

const { Op } = require("sequelize");

exports.getWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;

    // Start of week (Monday)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const appliedThisWeek = await JobApplication.count({
      where: {
        user_id: userId,
        application_date: {
          [Op.gte]: startOfWeek
        }
      }
    });

    const user = await User.findByPk(userId, {
      attributes: ["weekly_goal"]
    });

    res.json({
      weekly_goal: user.weekly_goal, // ✅ NO DEFAULT
      applied: appliedThisWeek
    });
  } catch (err) {
    console.error("WEEKLY GOAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * DASHBOARD SUMMARY
 * GET /api/dashboard/summary
 */
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await JobApplication.count({ where: { user_id: userId } });

    const interested = await JobApplication.count({
      where: { user_id: userId, status: "interested" }
    });

    const applied = await JobApplication.count({
      where: { user_id: userId, status: "applied" }
    });

    const interview = await JobApplication.count({
      where: { user_id: userId, status: "interview" }
    });

    const offer = await JobApplication.count({
      where: { user_id: userId, status: "offer" }
    });

    const rejected = await JobApplication.count({
      where: { user_id: userId, status: "rejected" }
    });

    res.json({
      total,
      interested,
      applied,
      interview,
      offer,
      rejected
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * APPLICATIONS BY MONTH
 * GET /api/dashboard/timeline
 */
exports.getTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    const timeline = await JobApplication.findAll({
      where: { user_id: userId },
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("application_date"), "%Y-%m"),
          "month"
        ],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
      ],
      group: ["month"],
      order: [["month", "ASC"]]
    });

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * TOP COMPANIES
 * GET /api/dashboard/top-companies
 */
exports.getTopCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const companies = await JobApplication.findAll({
      where: { user_id: userId },
      attributes: [
        "company_id",
        [Sequelize.fn("COUNT", Sequelize.col("JobApplication.id")), "count"]
      ],
      include: [
        {
          model: Company,
          attributes: ["name"]
        }
      ],
      group: ["company_id"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: 5
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * OFFER SUCCESS RATE
 * GET /api/dashboard/success-rate
 */
exports.getSuccessRate = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await JobApplication.count({ where: { user_id: userId } });
    const offers = await JobApplication.count({
      where: { user_id: userId, status: "offer" }
    });

    const successRate = total === 0 ? 0 : ((offers / total) * 100).toFixed(2);

    res.json({
      totalApplications: total,
      offers,
      successRate: `${successRate}%`
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
