const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSubmissions,
  createSubmission,
} = require("../controllers/submissionController");

router.get("/", auth, getSubmissions);
router.post("/", auth, createSubmission);

module.exports = router;
