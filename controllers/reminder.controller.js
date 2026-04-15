const { Reminder, JobApplication, Company } = require("../models");

/**
 * CREATE REMINDER
 * POST /api/reminders
 */
exports.createReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { application_id, reminder_date, message } = req.body;

    console.log("CREATE REMINDER BODY:", req.body);

    const application = await JobApplication.findOne({
      where: { id: application_id, user_id: userId }
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const reminder = await Reminder.create({
      user_id: userId,
      application_id,
      reminder_date,
      message
    });

    res.status(201).json(reminder);
  } catch (error) {
    // 🔥 THIS IS THE KEY
    console.error("CREATE REMINDER BACKEND ERROR:");
    console.error(error);
    console.error(error?.parent);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


/**
 * GET USER REMINDERS
 * GET /api/reminders
 */


exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { user_id: req.user.id },
      order: [["reminder_date", "ASC"]],
      include: [
        {
          model: JobApplication,
          attributes: ["job_title"],
          include: [
            {
              model: Company,
              attributes: ["name"]
            }
          ]
        }
      ]
    });

    res.json(reminders);
  } catch (error) {
    console.error("GET REMINDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * DELETE REMINDER
 * DELETE /api/reminders/:id
 */
exports.deleteReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminderId = req.params.id;

    const deleted = await Reminder.destroy({
      where: { id: reminderId, user_id: userId }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
