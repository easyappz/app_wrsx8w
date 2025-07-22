import React, { useState } from 'react';
import { uploadPhoto } from '../../api/photos';

function UploadPhoto() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await uploadPhoto({ url, description });
      setSuccess('Фотография успешно загружена!');
      setUrl('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка при загрузке фотографии.');
    }
  };

  return (
    <div className="App card">
      <h2>Загрузить фотографию</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="URL фотографии"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Загрузить</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default UploadPhoto;
