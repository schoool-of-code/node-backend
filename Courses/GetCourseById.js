const { Courses } = require("./index");

module.exports.handler = async (event) => {
  const courseId = event.pathParameters.id;
  const newCourses = new Courses();
  return await newCourses.getCourse(courseId);
};
``;
