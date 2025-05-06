const user = require("./user");
const assignment = require("./assignment");
const submission = require("./submission");

module.exports = (mongoose) => {
  const models = {
    User: user(mongoose),
    Assignment: assignment(mongoose),
    Submission: submission(mongoose),
  };
  return models;
};