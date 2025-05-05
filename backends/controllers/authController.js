const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token: "mock-token", role: user.role, id: user._id });
  } catch (err) {
    logger.error("Login error", { err });
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a simple reset token using Math.random and timestamp
    const resetToken = `${Math.random()
      .toString(36)
      .substr(2, 10)}${Date.now().toString(36)}`;
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    logger.info(`Password reset requested for user ${username}`);
    res.json({ message: "Reset token generated", resetToken });
  } catch (err) {
    logger.error("Forgot password error", { err });
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    logger.info(`Password reset successful for user ${user.username}`);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    logger.error("Reset password error", { err });
    res.status(500).json({ message: "Server error" });
  }
};
