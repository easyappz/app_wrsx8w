import { instance } from './axios';

/**
 * Fetch photos for rating with optional filters
 * @param {Object} filters - Filters for photos
 * @param {string} filters.gender - Gender filter
 * @param {number} filters.minAge - Minimum age filter
 * @param {number} filters.maxAge - Maximum age filter
 * @returns {Promise<Object>} Response data with photos
 */
export const getPhotosForRating = async (filters = {}) => {
  const { gender, minAge, maxAge } = filters;
  const params = {};
  if (gender) params.gender = gender;
  if (minAge) params.minAge = minAge;
  if (maxAge) params.maxAge = maxAge;

  const response = await instance.get('/api/photos/rating', { params });
  return response.data;
};

/**
 * Submit a rating for a photo
 * @param {string} photoId - ID of the photo to rate
 * @param {number} rating - Rating value
 * @returns {Promise<Object>} Response data
 */
export const submitPhotoRating = async (photoId, rating) => {
  const response = await instance.post('/api/ratings', { photoId, rating });
  return response.data;
};

/**
 * Fetch user profile data including points
 * @returns {Promise<Object>} Response data with user profile
 */
export const getUserProfile = async () => {
  const response = await instance.get('/api/profile');
  return response.data;
};
