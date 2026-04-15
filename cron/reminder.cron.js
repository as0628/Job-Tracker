const cron = require("node-cron");
const { Reminder, User, JobApplication, Company } = require("../models");
const sendEmail = require("../utils/sendEmail");
const { Op } = require("sequelize");

/**
 * Runs every minute
 * Checks pending reminders and sends emails
 */
cron.schedule("* * * * *", async () => {
  try {
    const reminders = await Reminder.findAll({
      where: {
        reminder_date: { [Op.lte]: new Date() },
        is_sent: false
      },
      include: [
        {
          model: User,
          attributes: ["email", "name"]
        },
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

    for (const reminder of reminders) {
      const user = reminder.User;
      const application = reminder.JobApplication;
      const company = application.Company;

      const emailText = `
Hello ${user.name},

This is a reminder for your job application.

📌 Position: ${application.job_title}
🏢 Company: ${company.name}
⏰ Reminder Time: ${new Date(reminder.reminder_date).toLocaleString()}

Message:
${reminder.message || "No additional message"}

Best of luck 🍀  
Job Tracker
      `;

      await sendEmail(
        user.email,
        "🔔 Job Application Reminder",
        emailText
      );

      // Mark reminder as sent
      reminder.is_sent = true;
      await reminder.save();

      console.log("📨 Reminder sent to:", user.email);
    }
  } catch (error) {
    console.error("CRON EMAIL ERROR:", error);
  }
});
