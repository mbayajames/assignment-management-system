const express = require('express');
const auth = require('../middleware/auth');
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');

const router = express.Router();

router.post('/', auth(['admin']), createAssignment);
router.get('/', auth(), getAssignments);
router.get('/:id', auth(), getAssignmentById);
router.put('/:id', auth(['admin']), updateAssignment);
router.delete('/:id', auth(['admin']), deleteAssignment);

module.exports = router;
