const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const auth = require("../middleware/auth");

router.get("/", auth, submissionController.getAllSubmissions);
router.get("/:id", auth, submissionController.getSubmissionById);
router.post("/", auth, submissionController.createSubmission);
router.put("/:id", auth, submissionController.updateSubmission);
router.delete("/:id", auth, submissionController.deleteSubmission);
router.put("/:id/mark", auth, submissionController.markSubmission);

module.exports = router;
