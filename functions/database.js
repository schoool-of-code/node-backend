const { database } = require("../helpers/get-db-client");

const getCourses = async (course_id) => {
  const selectedRows = await database("courses")
    .select("id", "title", "description", "solution", "video_id")
    .where({ id: course_id });
  return selectedRows;
};

module.exports = {
  getCourses,
};
