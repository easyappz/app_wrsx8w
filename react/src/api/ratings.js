import { instance } from './axios';

export const getPhotosForRating = async (filters) => {
  const { gender, minAge, maxAge } = filters;
  let url = '/api/photos/rating';
  const params = [];
  if (gender) params.push(`gender=${gender}`);
  if (minAge) params.push(`minAge=${minAge}`);
  if (maxAge) params.push(`maxAge=${maxAge}`);
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  return await instance.get(url);
};

export const ratePhoto = async (data) => {
  return await instance.post('/api/ratings', data);
};

export const getMyRatings = async () => {
  return await instance.get('/api/ratings/my');
};
