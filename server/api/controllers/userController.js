const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, gender, username } = req.body;

    const updateData = {};
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (username) updateData.username = username;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
