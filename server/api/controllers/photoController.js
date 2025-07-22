const Photo = require('../../models/Photo');
const User = require('../../models/User');
const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('photo');

// Upload photo
exports.uploadPhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      const photo = new Photo({
        userId: req.user.userId,
        url: `/uploads/${req.file.filename}`,
      });
      await photo.save();
      res.status(201).json({ message: 'Photo uploaded successfully', photo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Toggle photo active status
exports.togglePhotoActive = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.userId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    const user = await User.findById(req.user.userId);
    if (!photo.isActive && user.points < 1) {
      return res.status(400).json({ error: 'Not enough points to activate photo' });
    }
    photo.isActive = !photo.isActive;
    if (!photo.isActive) {
      user.points += 1;
    } else {
      user.points -= 1;
    }
    await photo.save();
    await user.save();
    res.json({ message: 'Photo status updated', photo, points: user.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get photos for rating with filters
exports.getPhotosForRating = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const userId = req.user.userId;

    // Build filter for users
    let userFilter = {};
    if (gender) userFilter.gender = gender;
    if (minAge || maxAge) {
      userFilter.age = {};
      if (minAge) userFilter.age.$gte = Number(minAge);
      if (maxAge) userFilter.age.$lte = Number(maxAge);
    }

    // Find users matching the filter
    const users = await User.find(userFilter);
    const userIds = users.map(user => user._id);

    // Find active photos from filtered users, excluding own photos
    const photos = await Photo.find({
      userId: { $in: userIds, $ne: userId },
      isActive: true,
    }).populate('userId');

    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's photos
exports.getUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.userId });
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
