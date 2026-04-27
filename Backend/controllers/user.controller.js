const { User } = require("../models");



/**
 * GET USER PROFILE
 * GET /api/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "name",
        "email",
        "career_goal",
        "target_title",
        "target_date",
        "salary_min",
        "salary_max",
        "currency",
        "current_status",
        "resume_path",
        "cover_letter_path",
        "createdAt"
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      career_goal,
      target_title,
      target_date,
      salary_min,
      salary_max,
      currency,
      current_status
    } = req.body;

    const updateData = {
      career_goal,
      target_title,
      target_date,
      salary_min,
      salary_max,
      currency,
      current_status
    };

    // Resume upload (optional)
    if (req.files && req.files.resume) {
      updateData.resume_path = req.files.resume[0].path;
    }

    // Cover letter upload (optional)
    if (req.files && req.files.cover_letter) {
      updateData.cover_letter_path = req.files.cover_letter[0].path;
    }

    await User.update(updateData, {
      where: { id: userId }
    });

    res.json({
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weekly_goal } = req.body;

    if (!weekly_goal || weekly_goal < 1) {
      return res.status(400).json({
        message: "Weekly goal must be at least 1"
      });
    }

    await User.update(
      { weekly_goal },
      { where: { id: userId } }
    );

    res.json({ message: "Weekly goal updated successfully" });
  } catch (err) {
    console.error("UPDATE WEEKLY GOAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
