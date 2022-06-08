const {
  sendResponse,
  createSubmission,
  getSubmission,
} = require("../functions/index");
const { getCourses } = require("../functions/database");

class CodeCompiler {
  async CompileCode(data) {
    const { source_code, language_id } = data;
    const selectedRows = await getCourses();
    console.log(selectedRows);
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
  }
}

module.exports = { CodeCompiler };
