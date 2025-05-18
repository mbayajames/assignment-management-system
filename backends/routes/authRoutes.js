const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
