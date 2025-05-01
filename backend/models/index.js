const { Sequelize } = require("sequelize");
const sequelize = require("../config/dbConfig");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./user")(sequelize, Sequelize);
db.Assignment = require("./assignment")(sequelize, Sequelize);
db.Submission = require("./submission")(sequelize, Sequelize);

// Define relationships
db.User.hasMany(db.Assignment, { foreignKey: "createdBy" });
db.Assignment.belongsTo(db.User, { foreignKey: "createdBy" });

db.User.hasMany(db.Submission, { foreignKey: "studentId" });
db.Submission.belongsTo(db.User, { foreignKey: "studentId" });

db.Assignment.hasMany(db.Submission, { foreignKey: "assignmentId" });
db.Submission.belongsTo(db.Assignment, { foreignKey: "assignmentId" });

db.User.belongsToMany(db.Assignment, {
  through: "AssignmentUsers",
  foreignKey: "userId",
});
db.Assignment.belongsToMany(db.User, {
  through: "AssignmentUsers",
  foreignKey: "assignmentId",
});

// Sync database
db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

module.exports = db;
