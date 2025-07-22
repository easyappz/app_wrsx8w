const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  userId: {
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
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }]
});

module.exports = mongoose.model('Photo', PhotoSchema);
