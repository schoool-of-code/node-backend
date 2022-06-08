const { CodeCompiler } = require("./CodeCompiler");

module.exports.handler = async (event) => {
  const cleanedData = JSON.parse(event.body);
  const newCompiler = new CodeCompiler();
  return await newCompiler.CompileCode(cleanedData);
};
``;
