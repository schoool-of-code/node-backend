const { Courses } = require("./index");

module.exports.handler = async () => {
  const newCourses = new Courses();
  return await newCourses.getAllCourses();
};