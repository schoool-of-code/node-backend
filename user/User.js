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
      const { user_pool_id, client_id } = process.env;

      const params = {
        UserPoolId: user_pool_id,
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
          UserPoolId: user_pool_id,
          Username: email,
          Permanent: true,
        };
        await this.cognito.adminSetUserPassword(paramsForSetPass).promise();
      }

      return this.LoginUser(data);
    } catch (error) {
      const message = error.message ? error.message : "Internal server error";
      console.log(error);
      return sendResponse(500, { message });
    }
  }

  async LoginUser(data) {
    try {
      const { email, password } = data;
      const { user_pool_id, client_id } = process.env;

      const params = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        UserPoolId: user_pool_id,
        ClientId: client_id,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      };
      const response = await this.cognito.adminInitiateAuth(params).promise();
      return sendResponse(200, {
        message: "Success",
        token: response.AuthenticationResult.IdToken,
      });
    } catch (error) {
      const message = error.message ? error.message : "Internal server error";
      console.log(error);
      return sendResponse(500, { message });
    }
  }
}

module.exports = { User };
