const Rating = require('../../models/Rating');
const Photo = require('../../models/Photo');
const User = require('../../models/User');

// Rate a photo
exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (!photo.isActive) {
      return res.status(403).json({ error: 'Photo is not active for rating' });
    }

    if (photo.userId.toString() === req.user.id) {
      return res.status(403).json({ error: 'Cannot rate your own photo' });
    }

    const existingRating = await Rating.findOne({ photoId, userId: req.user.id });
    if (existingRating) {
      return res.status(403).json({ error: 'You have already rated this photo' });
    }

    const rating = new Rating({
      photoId,
      userId: req.user.id,
      score
    });

    await rating.save();

    photo.ratings.push(rating._id);
    await photo.save();

    const user = await User.findById(req.user.id);
    user.points += 1;
    await user.save();

    res.status(201).json({ message: 'Photo rated successfully', rating });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rate photo: ' + error.message });
  }
};

// Get user's ratings
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.user.id }).populate('photoId');
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user ratings: ' + error.message });
  }
};
