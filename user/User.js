const { sendResponse, validateInput } = require("../functions/index");

class User {
  constructor(cognito) {
    this.cognito = cognito;
  }

  async RegisterUser(data) {
    try {
      const isValid = await validateInput(data);
      if (!isValid) return "Invalid Input";
      const { email, password } = data;
      const { USER_POOL_ID } = process.env.USER_POOL_ID;

      const params = {
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
        MessageAction: "SUPPRESS",
      };
      const response = await this.cognito.adminCreateUser(params).promise();

      if (response.User) {
        const paramsForSetPass = {
          Password: password,
          UserPoolId: USER_POOL_ID,
          Username: email,
          Permanent: true,
        };
        await this.cognito.adminSetUserPassword(paramsForSetPass).promise();
      }
      return true;
    } catch (error) {
      const message = error.message ? error.message : "Internal server error";
      console.log(error);
      return sendResponse(500, { message });
    }
  }

  async LoginUser(data) {
    const { email, password } = JSON.parse(data);
    const { USER_POOL_ID, USER_POOL_CLIENT_ID } = process.env;

    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
    const response = await cognito.adminInitiateAuth(params).promise();
    return sendResponse(200, {
      message: "Success",
      token: response.AuthenticationResult.IdToken,
    });
  }
}

module.exports = { User };
