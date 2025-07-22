import React, { useState, useEffect } from 'react';
import { getPhotosForRating, ratePhoto } from '../../api/ratings';
import { getProfile } from '../../api/auth';

function RatePhotos() {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchPhotos();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfile();
      if (response.data.user) {
        setUserPoints(response.data.user.points || 0);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при загрузке профиля.');
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await getPhotosForRating({ gender, minAge, maxAge });
      setPhotos(response.data.photos || []);
      if (response.data.photos.length > 0) {
        setCurrentPhoto(response.data.photos[0]);
      } else {
        setCurrentPhoto(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при загрузке фотографий для оценки.');
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchPhotos();
  };

  const handleRating = async (photoId, rating) => {
    try {
      await ratePhoto({ photoId, rating });
      setSuccess('Оценка сохранена! Вам начислен 1 балл.');
      setUserPoints(userPoints + 1);
      const updatedPhotos = photos.filter((photo) => photo._id !== photoId);
      setPhotos(updatedPhotos);
      if (updatedPhotos.length > 0) {
        setCurrentPhoto(updatedPhotos[0]);
      } else {
        setCurrentPhoto(null);
        fetchPhotos();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при отправке оценки.');
    }
  };

  return (
    <div className="App">
      <h2>Оценить фотографии</h2>
      <div className="card">
        <h3>Текущие баллы: {userPoints}</h3>
      </div>
      <div className="card">
        <h3>Фильтры</h3>
        <form onSubmit={handleFilterSubmit}>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Любой пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
          <input
            type="number"
            placeholder="Минимальный возраст"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
          />
          <input
            type="number"
            placeholder="Максимальный возраст"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
          />
          <button type="submit">Применить фильтры</button>
        </form>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {currentPhoto ? (
        <div className="photo-item card">
          <img src={currentPhoto.url} alt={currentPhoto.description || 'Фотография для оценки'} />
          <p>{currentPhoto.description || 'Без описания'}</p>
          <div>
            <button onClick={() => handleRating(currentPhoto._id, 1)}>1</button>
            <button onClick={() => handleRating(currentPhoto._id, 2)}>2</button>
            <button onClick={() => handleRating(currentPhoto._id, 3)}>3</button>
            <button onClick={() => handleRating(currentPhoto._id, 4)}>4</button>
            <button onClick={() => handleRating(currentPhoto._id, 5)}>5</button>
          </div>
        </div>
      ) : (
        <p>Фотографии для оценки не найдены. Попробуйте изменить фильтры.</p>
      )}
    </div>
  );
}

export default RatePhotos;
