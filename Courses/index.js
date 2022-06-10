const { sendResponse } = require("../functions/index");
const { getCourses } = require("../functions/database");

class Courses {
  async getCourse(courseId) {
    const selectedRows = await getCourses(courseId);

    return sendResponse(200, {
      message: "Success",
      data: selectedRows[0],
    });
  }
}

module.exports = { Courses };
