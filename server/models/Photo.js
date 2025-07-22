const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  ratings: [ratingSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', photoSchema);
