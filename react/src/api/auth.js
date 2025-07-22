import { instance } from './axios';

export const register = async (data) => {
  return await instance.post('/api/register', data);
};

export const login = async (data) => {
  return await instance.post('/api/login', data);
};

export const getProfile = async () => {
  return await instance.get('/api/profile');
};

export const updateProfile = async (data) => {
  return await instance.put('/api/profile', data);
};
