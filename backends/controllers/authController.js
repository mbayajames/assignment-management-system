const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(64).toString('hex');

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      emailToken,
      isVerified: false,
    });

    await user.save();

    const url = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
    await sendEmail(email, 'Verify Email', `Click to verify: ${url}`);

    res.status(201).json({ msg: 'Registration successful, check your email to verify' });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ emailToken: token });

    if (!user) return res.status(400).json({ msg: 'Invalid token' });

    user.emailToken = null;
    user.isVerified = true;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const user = await User.findOneAndUpdate({ email }, {
      resetPasswordToken: token,
      resetPasswordExpire: Date.now() + 3600000,
    });

    if (!user) return res.status(400).json({ msg: 'User not found' });

    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail(email, 'Reset Password', `Click to reset: ${url}`);

    res.json({ msg: 'Reset password email sent' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};
