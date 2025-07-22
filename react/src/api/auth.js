import { instance } from './axios';

// Регистрация нового пользователя
export const register = async (data) => {
  try {
    const response = await instance.post('/api/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Произошла ошибка при регистрации' };
  }
};

// Вход пользователя
export const login = async (data) => {
  try {
    const response = await instance.post('/api/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Произошла ошибка при входе' };
  }
};