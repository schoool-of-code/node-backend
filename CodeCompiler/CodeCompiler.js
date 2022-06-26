const {
  sendResponse,
  createSubmission,
  getSubmission,
  createBatchSubmission,
  getBatchSubmission,
} = require("../functions/index");
const {
  getCourses,
  getTestsByCourseIdAndSubmission,
} = require("../functions/database");

const sleep = async (milliseconds) => {
  await new Promise((resolve) => {
    return setTimeout(resolve, milliseconds);
  });
};

class CodeCompiler {
  async CompileCode(data) {
    let errorMessage = "";
    const { source_code, language_id, course_id } = data;

    const selectedRows = await getCourses(course_id);
    const decodeSourceCode = Buffer.from(source_code, "base64").toString(
      "utf-8"
    );

    const languageOptions = {
      javascript: {
        required: selectedRows.javascript_required_code,
        input: selectedRows.javascript_input_code,
      },
      python: {
        required: selectedRows.python_required_code,
        input: selectedRows.python_input_code,
      },
      csharp: {
        required: selectedRows.csharp_required_code,
        input: selectedRows.csharp_input_code,
      },
    };

    let selectedLanguage =
      language_id === 63
        ? languageOptions.javascript
        : language_id === 71
        ? languageOptions.python
        : languageOptions.csharp;

    if (!decodeSourceCode.includes(selectedLanguage.required)) {
      errorMessage = `The code must include starting code to correctly run tests.`;
    }

    if (!errorMessage) {
      const inputedCode = selectedLanguage.input.replace(
        "{REPLACE HERE}",
        Buffer.from(source_code, "base64").toString("utf-8")
      );
      const finalCode = Buffer.from(inputedCode).toString("base64");

      const testCases = await getTestsByCourseIdAndSubmission(course_id, false);

      let formattedTests = "";
      testCases.forEach((element) => {
        formattedTests = formattedTests.concat(element.input, "*");
      });
      formattedTests = formattedTests.slice(0, formattedTests.length - 1);

      const encodedTests = Buffer.from(formattedTests).toString("base64");

      const inputData = {
        language_id: language_id,
        source_code: finalCode,
        stdin: encodedTests,
      };

      const submissionToken = await createSubmission(inputData);
      const submissionOutput = await getSubmission(submissionToken);

      const decodedOutputs = Buffer.from(
        submissionOutput.stdout,
        "base64"
      ).toString("utf-8");

      const formattedTestOuputs = decodedOutputs.split(/\r?\n/).slice(0, -1);

      let testOuputs = testCases.map((element, index) => {
        return {
          tabName: `Sample Test Case ${index}`,
          input: element.input,
          expectedOutput: element.expected_output,
          output: formattedTestOuputs[index],
          debugOutput: formattedTestOuputs.slice(
            0,
            formattedTestOuputs.length - testCases.length
          ),
        };
      });

      return sendResponse(200, {
        message: "Success",
        data: testOuputs,
      });
    } else {
      return sendResponse(400, {
        message: errorMessage,
      });
    }
  }
  async CompileSubmission(data) {
    let errorMessage = "";
    const { source_code, language_id, course_id } = data;

    const selectedRows = await getCourses(course_id);
    const decodeSourceCode = Buffer.from(source_code, "base64").toString(
      "utf-8"
    );

    const languageOptions = {
      javascript: {
        required: selectedRows.javascript_required_code,
        input: selectedRows.javascript_input_code,
      },
      python: {
        required: selectedRows.python_required_code,
        input: selectedRows.python_input_code,
      },
      csharp: {
        required: selectedRows.csharp_required_code,
        input: selectedRows.csharp_input_code,
      },
    };

    let selectedLanguage =
      language_id === 63
        ? languageOptions.javascript
        : language_id === 71
        ? languageOptions.python
        : languageOptions.csharp;

    if (!decodeSourceCode.includes(selectedLanguage.required)) {
      errorMessage = `The code must include starting code to correctly run tests.`;
    }

    if (!errorMessage) {
      const inputedCode = selectedLanguage.input.replace(
        "{REPLACE HERE}",
        Buffer.from(source_code, "base64").toString("utf-8")
      );
      const finalCode = Buffer.from(inputedCode).toString("base64");

      const testCases = await getTestsByCourseIdAndSubmission(course_id, true);

      const batchInputs = testCases.map((test) => {
        return {
          language_id: language_id,
          source_code: finalCode,
          stdin: Buffer.from(test.input).toString("base64"),
        };
      });
      console.log(batchInputs);

      const submissionResults = await createBatchSubmission(batchInputs);
      console.log(submissionResults);
      let formattedSubmissionTokens = "";
      submissionResults.forEach((element) => {
        formattedSubmissionTokens = formattedSubmissionTokens.concat(
          element.token,
          ","
        );
      });
      await sleep(3000);
      const submissionOutputs = await getBatchSubmission(
        formattedSubmissionTokens.slice(0, -1)
      );

      let testOuputs = testCases.map((element, index) => {
        return {
          tabName: `Sample Test Case ${index}`,
          input: element.input,
          expectedOutput: element.expected_output,
          output: submissionOutputs[index].stdout,
        };
      });

      return sendResponse(200, {
        message: "Success",
        data: testOuputs,
      });
    } else {
      return sendResponse(400, {
        message: errorMessage,
      });
    }
  }
}

module.exports = { CodeCompiler };
