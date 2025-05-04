const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const { User, Assignment, Submission } = require("./models");

const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const userRoutes = require("./routes/userRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/submissions", submissionRoutes);

// Error handling middleware
app.use(errorHandler);

// Seed initial data
const seedData = async () => {
  try {
    const lecturer = await User.findOne({ username: "lecturer" });
    if (!lecturer) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "lecturer",
        password: hashedPassword,
        role: "admin",
      });
    }
    const student1 = await User.findOne({ username: "student1" });
    if (!student1) {
      const hashedPassword = await bcrypt.hash("student123", 10);
      const user1 = await User.create({
        username: "student1",
        password: hashedPassword,
        role: "student",
      });
      const hashedPassword2 = await bcrypt.hash("student123", 10);
      const user2 = await User.create({
        username: "student2",
        password: hashedPassword2,
        role: "student",
      });
      await Assignment.create({
        title: "Math Assignment 1",
        description: "Solve 10 algebra problems",
        dueDate: new Date("2025-05-01"),
        assignedTo: [user1._id, user2._id],
      });
    }
  } catch (err) {
    logger.error("Error seeding data", { err });
  }
};

seedData();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
