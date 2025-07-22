const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('./api/controllers/authController');
const photoController = require('./api/controllers/photoController');
const ratingController = require('./api/controllers/ratingController');
const userController = require('./api/controllers/userController');

const router = express.Router();

// JWT Middleware
const JWT_SECRET = 'mysecretkey123';
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-reset-password', authController.requestResetPassword);
router.post('/reset-password', authController.resetPassword);

// User Routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// Photo Routes
router.post('/photos/upload', authenticateToken, photoController.uploadPhoto);
router.put('/photos/:photoId/toggle-active', authenticateToken, photoController.togglePhotoActive);
router.get('/photos/rating', authenticateToken, photoController.getPhotosForRating);
router.get('/photos/my', authenticateToken, photoController.getUserPhotos);

// Rating Routes
router.post('/ratings', authenticateToken, ratingController.ratePhoto);
router.get('/ratings/my', authenticateToken, ratingController.getUserRatings);

// Test Routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
