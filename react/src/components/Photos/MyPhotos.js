import React, { useState, useEffect } from 'react';
import { getMyPhotos, togglePhotoActive } from '../../api/photos';

function MyPhotos() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetchPhotos();
    fetchUserProfile();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await getMyPhotos();
      setPhotos(response.data.photos || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при загрузке фотографий.');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getMyPhotos();
      if (response.data.user) {
        setUserPoints(response.data.user.points || 0);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при загрузке данных пользователя.');
    }
  };

  const handleToggleActive = async (photoId, isActive) => {
    if (!isActive && userPoints <= 0) {
      setError('У вас недостаточно баллов для активации фотографии.');
      return;
    }
    try {
      await togglePhotoActive(photoId);
      setSuccess(isActive ? 'Фотография деактивирована.' : 'Фотография активирована.');
      fetchPhotos();
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при изменении статуса фотографии.');
    }
  };

  return (
    <div className="App">
      <h2>Мои фотографии</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="photo-grid">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo._id} className="photo-item card">
              <img src={photo.url} alt={photo.description || 'Фотография'} />
              <p>{photo.description || 'Без описания'}</p>
              <p>Статус: {photo.isActive ? 'Активна' : 'Неактивна'}</p>
              <button onClick={() => handleToggleActive(photo._id, photo.isActive)}>
                {photo.isActive ? 'Деактивировать' : 'Активировать'}
              </button>
            </div>
          ))
        ) : (
          <p>У вас пока нет загруженных фотографий.</p>
        )}
      </div>
    </div>
  );
}

export default MyPhotos;
