const {
  sendResponse,
  createSubmission,
  getSubmission,
} = require("../functions/index");
const { getCourses } = require("../functions/database");

class CodeCompiler {
  async CompileCode(data) {
    let errorMessage = "";
    const { source_code, language_id, course_id } = data;

    const selectedRows = await getCourses(course_id);
    const decodeSourceCode = Buffer.from(source_code, "base64").toString(
      "utf-8"
    );

    if (!decodeSourceCode.includes(selectedRows.javascript_required_code)) {
      errorMessage = `The code must include starting code to correctly run tests.`;
    }

    if (!errorMessage) {
      const inputData = {
        language_id: language_id,
        source_code: source_code,
      };

      const submissionToken = await createSubmission(inputData);
      const submissionOutput = await getSubmission(submissionToken);
      return sendResponse(200, {
        message: "Success",
        data: {
          tabName: "Sample Test Case 0",
          input: ["10", "1 1 3 1 2 1 3 3 3"],
          output: ["None"],
          expectedOutput: ["4"],
          debugOutput: submissionOutput.stdout,
        },
      });
    } else {
      return sendResponse(400, {
        message: errorMessage,
      });
    }
  }
}

module.exports = { CodeCompiler };
