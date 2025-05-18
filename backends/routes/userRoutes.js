const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.get('/', auth(['admin']), getAllUsers);
router.get('/:id', auth(), getUserById);
router.put('/:id', auth(['admin']), updateUser);
router.delete('/:id', auth(['admin']), deleteUser);

module.exports = router;
