const { sendResponse } = require("../functions/index");
const { getCourses, getAllCoursesQuery } = require("../functions/database");

class Courses {
  async getCourse(courseId) {
    const selectedRows = await getCourses(courseId);

    return sendResponse(200, {
      message: "Success",
      data: selectedRows[0],
    });
  }

  async getAllCourses() {
    const allCourses = await getAllCoursesQuery();

    return sendResponse(200, {
      message: "Success",
      data: allCourses,
    });
  }
}

module.exports = { Courses };
