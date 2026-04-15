const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attachment = sequelize.define(
  "Attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    application_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    file_type: {
      type: DataTypes.ENUM("resume", "company_doc"),
      allowNull: false
    }
  },
  {
    tableName: "attachments",
    timestamps: true // creates createdAt & updatedAt
  }
);

module.exports = Attachment;
