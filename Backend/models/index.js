const sequelize = require("../config/db");

// IMPORT MODELS FIRST (VERY IMPORTANT)
const User = require("./user.model");
const Company = require("./company.model");
const JobApplication = require("./jobApplication.model");
const Attachment = require("./attachment.model");
const Reminder = require("./reminder.model");

// =======================
// DEFINE RELATIONSHIPS
// =======================

// User → Company
User.hasMany(Company, { foreignKey: "user_id" });
Company.belongsTo(User, { foreignKey: "user_id" });

// User → JobApplication
User.hasMany(JobApplication, { foreignKey: "user_id" });
JobApplication.belongsTo(User, { foreignKey: "user_id" });

// Company → JobApplication
Company.hasMany(JobApplication, { foreignKey: "company_id" });
JobApplication.belongsTo(Company, { foreignKey: "company_id" });

// =======================
// ATTACHMENTS
// =======================

// User → Attachment
User.hasMany(Attachment, { foreignKey: "user_id" });
Attachment.belongsTo(User, { foreignKey: "user_id" });

// JobApplication → Attachment
JobApplication.hasMany(Attachment, { foreignKey: "application_id" });
Attachment.belongsTo(JobApplication, { foreignKey: "application_id" });

// Company → Attachment
Company.hasMany(Attachment, { foreignKey: "company_id" });
Attachment.belongsTo(Company, { foreignKey: "company_id" });

// =======================
// REMINDERS
// =======================

// User → Reminder
User.hasMany(Reminder, { foreignKey: "user_id" });
Reminder.belongsTo(User, { foreignKey: "user_id" });

// JobApplication → Reminder
JobApplication.hasMany(Reminder, { foreignKey: "application_id" });
Reminder.belongsTo(JobApplication, { foreignKey: "application_id" });

module.exports = {
  sequelize,
  User,
  Company,
  JobApplication,
  Attachment,
  Reminder
};
