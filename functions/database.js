const { database } = require("../helpers/get-db-client");

const getCourses = async (course_id) => {
  const selectedRows = await database("courses")
    .select("id", "title", "description", "solution", "video_id")
    .where({ id: course_id });
  return selectedRows;
};

const getTestsByCourseIdAndSubmission = async (course_id, submission) => {
  const selectedRows = await database("test_cases")
    .select("id", "input", "expected_output")
    .where({ course_id: course_id, submission: submission });
  return selectedRows;
};

//A query to the courses table of the database. Should return the selected columns for every courses.
const getAllCoursesQuery = async () => {
  const courses = await database("courses")
    .select("id", "title", "description", "solution", "video_id", "level", "skills", "status", "category", "subdomain", "successRate");
  return courses;
};

module.exports = {
  getCourses,
  getAllCoursesQuery,
  getTestsByCourseIdAndSubmission,
};
