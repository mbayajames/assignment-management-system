const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const logger = require("./utils/logger");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Allow requests from frontend

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/assignment_system",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error", { err }));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
