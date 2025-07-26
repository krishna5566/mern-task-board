const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch {
    res.status(400).json({ error: 'Email already exists' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetURL = `/reset-password/${resetToken}`;
    const emailContent = {
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await sendEmail(emailContent);

    res.status(200).json({ status: true, message: "Reset email sent successfully", data:resetURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Something went wrong", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const resetToken = req.params.token;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ status: false, message: 'Token is invalid or expired' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ status: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Failed to reset password', error: err.message });
  }
};

module.exports = { signup, login ,  forgotPassword,resetPassword};