import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/auth';

function Profile() {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.data.user) {
        setUser(response.data.user);
        setUsername(response.data.user.username || '');
        setAge(response.data.user.age || '');
        setGender(response.data.user.gender || '');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при загрузке профиля.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateProfile({ username, age: Number(age), gender });
      setSuccess('Профиль обновлен успешно!');
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при обновлении профиля.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="App card">
      <h2>Профиль</h2>
      <div>
        <p><strong>Имя пользователя:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Возраст:</strong> {user.age || 'Не указан'}</p>
        <p><strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Не указан'}</p>
        <p><strong>Баллы:</strong> {user.points || 0}</p>
      </div>
      <h3>Редактировать профиль</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Не указан</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
        <button type="submit">Сохранить</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', marginTop: '20px' }}>
        Выйти
      </button>
    </div>
  );
}

export default Profile;
