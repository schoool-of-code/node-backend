const { sendResponse } = require("../functions/index");
const { getCourses, getAllCoursesQuery } = require("../functions/database");

class Courses {
  async getCourse(courseId) {
    const selectedRows = await getCourses(courseId);

    return sendResponse(200, {
      message: "Success",
      data: selectedRows,
    });
  }

  //Uses a query function to retrieve all courses from the database and returns them as data.
  async getAllCourses() {
    const allCourses = await getAllCoursesQuery();

    return sendResponse(200, {
      message: "Success",
      data: allCourses,
    });
  }
}

module.exports = { Courses };
