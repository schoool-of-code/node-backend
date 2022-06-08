const { User } = require("../../user/User");

describe("The User Register User method", () => {
  it.each([
    [{ password: "test" }, "Invalid Input"],
    [{ email: "test" }, "Invalid Input"],
  ])(
    "should be able to return false if input is invalid",
    async (input, expected) => {
      const testUser = new User();

      expect(await testUser.RegisterUser(input)).toBe(expected);
    }
  );
  it("should be able to make a call to cognito", async () => {
    const cognito = jest.fn("aws-sdk", () => {
      return {
        CognitoIdentityServiceProvider: class {
          adminCreateUser() {
            return this;
          }
          adminSetUserPassword() {
            return this;
          }

          promise() {
            return Promise.resolve(mockResponse);
          }
        },
      };
    });

    const testUser = new User(cognito);

    expect(
      await testUser.RegisterUser({
        email: "ivan@gmail.com",
        password: "123456",
      })
    ).toBe(expected);
  });
});
