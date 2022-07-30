const axios = require("axios");

const sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return response;
};

const validateInput = (data) => {
  const body = data;
  const { email, password } = body;
  if (!email || !password || password.length < 6) return false;
  return true;
};

const createSubmission = async (inputData) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.RAPID_API_ID,
    },
    data: inputData,
  };
  try {
    const response = await axios.request(options);
    return response.data.token;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getSubmission = async (token) => {
  const options = {
    method: "GET",
    url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.RAPID_API_ID,
    },
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (e) {
    return e;
  }
};

const createBatchSubmission = async (inputData) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.RAPID_API_ID,
    },
    data: { submissions: inputData },
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getBatchSubmission = async (token) => {
  const options = {
    method: "GET",
    url: `https://judge0-ce.p.rapidapi.com/submissions/batch`,
    params: { base64_encoded: "true", fields: "*", tokens: token },
    headers: {
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.RAPID_API_ID,
    },
  };
  try {
    const response = await axios.request(options);
    console.log(response);
    return response.data.submissions;
  } catch (e) {
    return e;
  }
};

module.exports = {
  sendResponse,
  validateInput,
  createSubmission,
  getSubmission,
  createBatchSubmission,
  getBatchSubmission,
};
