const multer = require('multer');
const path = require('path');
const Photo = require('../../models/Photo');
const User = require('../../models/User');
const Rating = require('../../models/Rating');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('photo');

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed: ' + err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const photo = new Photo({
        userId: req.user.id,
        filePath: req.file.path
      });

      await photo.save();
      res.status(201).json({ message: 'Photo uploaded successfully', photo });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photo: ' + error.message });
  }
};

// Toggle photo active status
exports.togglePhotoActive = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or not owned by user' });
    }

    const user = await User.findById(req.user.id);
    if (!photo.isActive && user.points < 10) {
      return res.status(403).json({ error: 'Not enough points to activate photo. Required: 10' });
    }

    photo.isActive = !photo.isActive;
    if (photo.isActive) {
      user.points -= 10;
    } else {
      user.points += 10;
    }

    await photo.save();
    await user.save();

    res.json({ message: 'Photo status updated', photo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle photo status: ' + error.message });
  }
};

// Get photos for rating
exports.getPhotosForRating = async (req, res) => {
  try {
    const photos = await Photo.find({ isActive: true, userId: { $ne: req.user.id } });
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos for rating: ' + error.message });
  }
};

// Get user's photos
exports.getUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.id });
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user photos: ' + error.message });
  }
};

// Get photo statistics
exports.getPhotoStats = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or not owned by user' });
    }

    const ratings = await Rating.find({ photoId }).populate('userId');
    const stats = {
      totalRatings: ratings.length,
      averageScore: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0,
      byGender: {
        male: {
          count: 0,
          average: 0
        },
        female: {
          count: 0,
          average: 0
        },
        other: {
          count: 0,
          average: 0
        }
      },
      byAge: {
        under20: {
          count: 0,
          average: 0
        },
        '20to30': {
          count: 0,
          average: 0
        },
        over30: {
          count: 0,
          average: 0
        }
      }
    };

    ratings.forEach(rating => {
      const user = rating.userId;
      // Gender stats
      if (user.gender === 'male') {
        stats.byGender.male.count++;
        stats.byGender.male.average += rating.score;
      } else if (user.gender === 'female') {
        stats.byGender.female.count++;
        stats.byGender.female.average += rating.score;
      } else {
        stats.byGender.other.count++;
        stats.byGender.other.average += rating.score;
      }

      // Age stats
      if (user.age && user.age < 20) {
        stats.byAge.under20.count++;
        stats.byAge.under20.average += rating.score;
      } else if (user.age && user.age <= 30) {
        stats.byAge['20to30'].count++;
        stats.byAge['20to30'].average += rating.score;
      } else if (user.age) {
        stats.byAge.over30.count++;
        stats.byAge.over30.average += rating.score;
      }
    });

    // Calculate averages for gender
    if (stats.byGender.male.count > 0) {
      stats.byGender.male.average /= stats.byGender.male.count;
    }
    if (stats.byGender.female.count > 0) {
      stats.byGender.female.average /= stats.byGender.female.count;
    }
    if (stats.byGender.other.count > 0) {
      stats.byGender.other.average /= stats.byGender.other.count;
    }

    // Calculate averages for age
    if (stats.byAge.under20.count > 0) {
      stats.byAge.under20.average /= stats.byAge.under20.count;
    }
    if (stats.byAge['20to30'].count > 0) {
      stats.byAge['20to30'].average /= stats.byAge['20to30'].count;
    }
    if (stats.byAge.over30.count > 0) {
      stats.byAge.over30.average /= stats.byAge.over30.count;
    }

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo statistics: ' + error.message });
  }
};
