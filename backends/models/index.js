const mongoose = require("../config/database");

module.exports = {
  User: require("./user")(mongoose),
  Assignment: require("./assignment")(mongoose),
  Submission: require("./submission")(mongoose),
};
