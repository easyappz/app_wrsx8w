const User = require('../../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, gender, age } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (age) user.age = age;
    await user.save();
    res.json({ message: 'Profile updated', user: { id: user._id, email: user.email, name: user.name, gender: user.gender, age: user.age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
