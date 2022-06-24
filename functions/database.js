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
      "javascript_required_code",
      "starting_code_python",
      "starting_code_csharp",
      "python_required_code",
      "csharp_required_code",
      "python_input_code"
    )
    .where({ id: course_id });
  return selectedRows[0];
};

const getTestsByCourseIdAndSubmission = async (course_id, submission) => {
  const selectedRows = await database("test_cases")
    .select("id", "input", "expected_output")
    .where({ course_id: course_id, submission: submission });
  return selectedRows;
};
module.exports = {
  getCourses,
  getTestsByCourseIdAndSubmission,
};
