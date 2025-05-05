const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSubmissions,
  createSubmission,
  updateSubmission,
  markSubmission,
  deleteSubmission,
} = require("../controllers/submissionController");

router.get("/", auth, getSubmissions);
router.post("/", auth, createSubmission);
router.patch("/:submissionId", auth, updateSubmission);
router.patch("/:submissionId/status", auth, markSubmission);
router.delete("/:submissionId", auth, deleteSubmission);

module.exports = router;
