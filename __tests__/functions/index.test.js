const { sendResponse, validateInput } = require("../../functions");

describe("The helper function sendResponse", () => {
  it("should take a two parameters and returns a structured response", () => {
    const response = sendResponse(200, { message: "success" });

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ message: "success" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
  });
});

test("ValidateInput should check that login inputs exist and return true if it does and false if they dont exist", () => {
  const validatedInput = validateInput({
    email: "ivan@gmail.com",
    password: "12qw34er",
  });

  const invalidInput = validateInput({});

  expect(validatedInput).toBe(true);
  expect(invalidInput).toBe(false);
});
