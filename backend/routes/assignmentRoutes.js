const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const auth = require("../middleware/auth");

router.get("/", auth, assignmentController.getAllAssignments);
router.get("/:id", auth, assignmentController.getAssignmentById);
router.post("/", auth, assignmentController.createAssignment);
router.put("/:id", auth, assignmentController.updateAssignment);
router.delete("/:id", auth, assignmentController.deleteAssignment);

module.exports = router;
