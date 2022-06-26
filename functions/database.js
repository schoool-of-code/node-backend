const { database } = require("../helpers/get-db-client");

const getCourses = async (course_id) => {
  const selectedRows = await database("courses")
    .select("id", "title", "description", "solution", "video_id")
    .where({ id: course_id });
  return selectedRows;
};

const getAllCoursesQuery = async () => {
  const courses = await database("courses")
    .select("id", "title", "description", "solution", "video_id", "level", "skills", "status", "category", "subdomain", "successRate");
  return courses;
};

module.exports = {
  getCourses,
  getAllCoursesQuery,
};
