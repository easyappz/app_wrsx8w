const Photo = require('../../../models/Photo');
const User = require('../../../models/User');

// Rate a photo
exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, rating } = req.body;
    const userId = req.user.id;

    if (!photoId || rating === undefined) {
      return res.status(400).json({ error: 'Photo ID and rating are required' });
    }

    // Check if photo exists and is active
    const photo = await Photo.findOne({ _id: photoId, isActive: true });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or not active' });
    }

    // Check if user has already rated this photo
    const alreadyRated = photo.ratings.some(r => r.userId.toString() === userId);
    if (alreadyRated) {
      return res.status(400).json({ error: 'You have already rated this photo' });
    }

    // Add rating to photo
    photo.ratings.push({ userId, rating });
    await photo.save();

    // Update rater's points (+1 for rating)
    await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });

    // Update photo owner's points (-1 for receiving a rating)
    await User.findByIdAndUpdate(photo.userId, { $inc: { points: -1 } });

    return res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get user's ratings
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await Photo.find({ 'ratings.userId': userId });

    if (!photos || photos.length === 0) {
      return res.status(404).json({ error: 'No ratings found for this user' });
    }

    return res.status(200).json({ ratings: photos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
