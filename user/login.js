const AWS = require("aws-sdk");
const { sendResponse, validateInput } = require("../functions");
const { User } = require("./User");
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  const cleanedData = JSON.parse(event.body);
  const newUser = new User(cognito);
  return await newUser.LoginUser(cleanedData);
};
``;
