const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  statsByGender: {
    male: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    female: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    other: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    }
  },
  statsByAge: {
    under20: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    from20to30: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    from30to40: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    over40: {
      count: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', PhotoSchema);
