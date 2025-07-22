import { instance } from './axios';

export const uploadPhoto = async (data) => {
  return await instance.post('/api/photos/upload', data);
};

export const getMyPhotos = async () => {
  return await instance.get('/api/photos/my');
};

export const togglePhotoActive = async (photoId) => {
  return await instance.put(`/api/photos/${photoId}/toggle-active`);
};
