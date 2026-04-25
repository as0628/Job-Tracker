const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  career_goal: DataTypes.STRING,
  career_goal: {
  type: DataTypes.STRING
},
target_title: {
  type: DataTypes.STRING
},
target_date: {
  type: DataTypes.DATE
},
salary_min: {
  type: DataTypes.DECIMAL(10, 2)
},
salary_max: {
  type: DataTypes.DECIMAL(10, 2)
},
currency: {
  type: DataTypes.STRING
},
current_status: {
  type: DataTypes.ENUM("fresher", "experienced")
},
resume_path: {
  type: DataTypes.STRING
},
cover_letter_path: {
  type: DataTypes.STRING
},

//   min_expected_salary: DataTypes.DECIMAL(10, 2),
//   max_expected_salary: DataTypes.DECIMAL(10, 2),
//   preferred_currency: {
//     type: DataTypes.STRING,
//     defaultValue: "INR"
//   }
 
reset_token: {
  type: DataTypes.STRING,
  allowNull: true
},
weekly_goal: {
  type: DataTypes.INTEGER,
  defaultValue: 12
},
reset_token_expiry: {
  type: DataTypes.DATE,
  allowNull: true
}
});
module.exports = User;
