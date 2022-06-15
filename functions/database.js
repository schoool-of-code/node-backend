const { database } = require("../helpers/get-db-client");

const getCourses = async (course_id) => {
  const selectedRows = await database("courses")
    .select(
      "id",
      "title",
      "description",
      "solution",
      "video_id",
      "starting_code_javascript",
      "javascript_required_code"
    )
    .where({ id: course_id });
  return selectedRows[0];
};

module.exports = {
  getCourses,
};
