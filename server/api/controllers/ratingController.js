const Rating = require('../../models/Rating');
const Photo = require('../../models/Photo');
const User = require('../../models/User');

// Rate a photo
exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    const userId = req.user.userId;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.userId.toString() === userId.toString()) {
      return res.status(400).json({ error: 'Cannot rate your own photo' });
    }

    const existingRating = await Rating.findOne({ photoId, userId });
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this photo' });
    }

    const rating = new Rating({ photoId, userId, score });
    await rating.save();

    // Update points: rater gains 1 point, photo owner loses 1 point
    const rater = await User.findById(userId);
    const photoOwner = await User.findById(photo.userId);
    rater.points += 1;
    photoOwner.points -= 1;
    await rater.save();
    await photoOwner.save();

    res.status(201).json({ message: 'Rating submitted', rating, points: rater.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get ratings for user's photos
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const photos = await Photo.find({ userId });
    const photoIds = photos.map(photo => photo._id);
    const ratings = await Rating.find({ photoId: { $in: photoIds } }).populate('userId');
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
