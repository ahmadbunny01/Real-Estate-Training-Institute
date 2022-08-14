const db = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Course = require("./Course");

const Enrolled_Courses = db.define(
  "Enrolled_Courses",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

User.belongsToMany(Course, { through: Enrolled_Courses, as: "enrolledCourses" });
Course.belongsToMany(User, { through: Enrolled_Courses, as: "enrolledUsers" });

module.exports = Enrolled_Courses;
