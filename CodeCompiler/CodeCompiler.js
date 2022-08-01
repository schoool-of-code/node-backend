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

const baseToString = (input) => Buffer.from(input, "base64").toString("utf-8");

const stringToBase = (input) => Buffer.from(input).toString("base64");

const getSelectedLanguage = (languageId, selectedRows) => {
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

  return languageId === 63
    ? languageOptions.javascript
    : languageId === 71
    ? languageOptions.python
    : languageOptions.csharp;
};

const insertUserCode = (selectedLanguage, source_code) => {
  const inputedCode = selectedLanguage.input.replace(
    "{REPLACE HERE}",
    baseToString(source_code)
  );
  return stringToBase(inputedCode);
};

class CodeCompiler {
  async CompileCode(data) {
    console.log(data);
    let errorMessage = "";
    const { source_code, language_id, course_id } = data;

    const selectedRows = await getCourses(course_id);
    const decodeSourceCode = baseToString(source_code);

    const selectedLanguage = getSelectedLanguage(language_id, selectedRows);
    console.log("section 1");
    if (!decodeSourceCode.includes(selectedLanguage.required)) {
      errorMessage = `The code must include starting code to correctly run tests.`;
    }

    if (!errorMessage) {
      const finalCode = insertUserCode(selectedLanguage, source_code);

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
      console.log("section 2");

      const submissionToken = await createSubmission(inputData);
      const submissionOutput = await getSubmission(submissionToken);
      console.log("section 3");
      console.log(submissionOutput);
      let formattedTestOuputs = "";
      let decodedError = null;
      if (submissionOutput.stdout) {
        const decodedOutputs = baseToString(submissionOutput.stdout);
        formattedTestOuputs = decodedOutputs.split(/\r?\n/).slice(0, -1);
      }
      if (submissionOutput.stderr) {
        decodedError = baseToString(submissionOutput.stderr);
      }
      console.log("section 4");

      let testOuputs = testCases.map((element, index) => {
        return {
          tabName: `Sample Test Case ${index}`,
          input: element.input,
          expectedOutput: element.expected_output,
          output: formattedTestOuputs[index],
          error: decodedError,
          debugOutput: formattedTestOuputs.slice(
            0,
            formattedTestOuputs.length - testCases.length
          ),
        };
      });
      console.log("section 5");

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
    const decodeSourceCode = baseToString(source_code);

    const selectedLanguage = getSelectedLanguage(language_id, selectedRows);

    if (!decodeSourceCode.includes(selectedLanguage.required)) {
      errorMessage = `The code must include starting code to correctly run tests.`;
    }

    if (!errorMessage) {
      const finalCode = insertUserCode(selectedLanguage, source_code);

      const testCases = await getTestsByCourseIdAndSubmission(course_id, true);

      const batchInputs = testCases.map((test) => {
        return {
          language_id: language_id,
          source_code: finalCode,
          stdin: Buffer.from(test.input).toString("base64"),
        };
      });

      const submissionResults = await createBatchSubmission(batchInputs);

      let formattedSubmissionTokens = "";
      submissionResults.forEach((element) => {
        formattedSubmissionTokens = formattedSubmissionTokens.concat(
          element.token,
          ","
        );
      });

      await sleep(2000);

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
