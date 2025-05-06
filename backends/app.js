const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const modelsFactory = require("./models");
const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const userRoutes = require("./routes/userRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const cors = require("cors");

// Load config file
const config = require("./config/config.json"); // Adjust path if config.json is elsewhere

dotenv.config();
const app = express();

// Initialize models with mongoose instance
const { User, Assignment, Submission } = modelsFactory(mongoose);

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// API Routes (before static files)
try {
  logger.info("Mounting auth routes...");
  app.use("/api/auth", authRoutes);
  logger.info("Mounting assignment routes...");
  app.use("/api/assignments", assignmentRoutes);
  logger.info("Mounting user routes...");
  app.use("/api/users", userRoutes);
  logger.info("Mounting submission routes...");
  app.use("/api/submissions", submissionRoutes);
} catch (err) {
  logger.error("Error mounting routes", { err });
  throw err;
}

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Serve the frontend for all other GET requests (React Router handling)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Error handling middleware
app.use(errorHandler);

// Catch-all for unmatched routes (return JSON)
app.use((req, res) => {
  logger.error(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGO_URI ||
      `mongodb://${config.development.host}:${config.development.port}/${config.development.database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error", { err }));

// Seed initial data
const bcrypt = require("bcryptjs");
const seedData = async () => {
  try {
    const lecturer = await User.findOne({ username: "lecturer" });
    if (!lecturer) {
      const hashedPassword = await bcrypt.hash("lecturer123", 10);
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
    logger.info("Seed data completed successfully");
  } catch (err) {
    logger.error("Error seeding data", { err });
  }
};

mongoose.connection.once("open", () => {
  seedData();
});

// Start server
const PORT = process.env.PORT || config.development.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
