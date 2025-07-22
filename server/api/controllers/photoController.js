const Photo = require('../models/Photo');
const User = require('../models/User');

// Upload a photo
exports.uploadPhoto = async (req, res) => {
  try {
    const { url, description } = req.body;
    const userId = req.user.id;

    if (!url) {
      return res.status(400).json({ error: 'Photo URL is required' });
    }

    const newPhoto = new Photo({
      userId,
      url,
      description,
      isActive: true,
      ratings: []
    });

    await newPhoto.save();
    return res.status(201).json({ message: 'Photo uploaded successfully', photo: newPhoto });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Toggle photo active status
exports.togglePhotoActive = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or unauthorized' });
    }

    photo.isActive = !photo.isActive;
    await photo.save();

    return res.status(200).json({ message: 'Photo status updated', photo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get photos for rating with filters
exports.getPhotosForRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gender, minAge, maxAge } = req.query;

    // Build filter for users
    let userFilter = {};
    if (gender) userFilter.gender = gender;
    if (minAge || maxAge) {
      userFilter.age = {};
      if (minAge) userFilter.age.$gte = Number(minAge);
      if (maxAge) userFilter.age.$lte = Number(maxAge);
    }

    // Find matching users
    const users = await User.find(userFilter);
    const userIds = users.map(user => user._id);

    // Find photos that match the criteria
    const photos = await Photo.find({
      userId: { $in: userIds },
      isActive: true,
      'ratings.userId': { $ne: userId } // Exclude photos already rated by the user
    });

    if (!photos || photos.length === 0) {
      return res.status(404).json({ error: 'No photos available for rating with the specified filters' });
    }

    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get user's photos
exports.getUserPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await Photo.find({ userId });

    if (!photos || photos.length === 0) {
      return res.status(404).json({ error: 'No photos found for this user' });
    }

    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get photo stats
exports.getPhotoStats = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or unauthorized' });
    }

    return res.status(200).json({ stats: { ratings: photo.ratings.length, averageRating: calculateAverageRating(photo.ratings) } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / ratings.length;
}
