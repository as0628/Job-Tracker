const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reminder = sequelize.define("Reminder", {
  reminder_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING
  },
  is_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Reminder;
