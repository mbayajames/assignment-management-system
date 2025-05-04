const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAssignments,
  createAssignment,
} = require("../controllers/assignmentController");

router.get("/", auth, getAssignments);
router.post("/", auth, createAssignment);

module.exports = router;
