const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const JobApplication = sequelize.define("JobApplication", {
  job_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  application_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "interested",
      "applied",
      "interview",
      "offer",
      "rejected"
    ),
    defaultValue: "applied"
  },

  expected_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  offered_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR"
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // ✅ Resume upload
  resume_path: {
    type: DataTypes.STRING,
    allowNull: true
  },

//   // ✅ Archive support (Teal-like)
 is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

//   // 🔜 For reminder feature (used later)
//   reminder_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: true
//   }
});

module.exports = JobApplication;
