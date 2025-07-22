import { instance } from './axios';

/**
 * Upload a new photo
 * @param {Object} data - Photo data including url and description
 * @returns {Promise<Object>} - Response data from the server
 */
export const uploadPhoto = async (data) => {
  const response = await instance.post('/api/photos/upload', data);
  return response.data;
};

/**
 * Get user's photos
 * @returns {Promise<Object>} - Response data containing user's photos
 */
export const getMyPhotos = async () => {
  const response = await instance.get('/api/photos/my');
  return response.data;
};

/**
 * Toggle photo active status
 * @param {string} photoId - ID of the photo to toggle
 * @returns {Promise<Object>} - Response data from the server
 */
export const togglePhotoActive = async (photoId) => {
  const response = await instance.put(`/api/photos/${photoId}/toggle-active`);
  return response.data;
};
