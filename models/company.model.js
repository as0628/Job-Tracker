const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Company = sequelize.define("Company", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  industry: DataTypes.STRING,
  size: DataTypes.STRING,
  contact_email: DataTypes.STRING,
   city: {
    type: DataTypes.STRING(100)
  },
  state: {
    type: DataTypes.STRING(100)
  },
  notes: DataTypes.TEXT
});

module.exports = Company;
