const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT
const JWT_SECRET = 'mysecretkey123';

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, name, gender, age } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const user = new User({ email, password, name, gender, age });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email, name, gender, age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email, name: user.name, gender: user.gender, age: user.age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password request (simplified, no email sending)
exports.requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    res.json({ message: 'Reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
