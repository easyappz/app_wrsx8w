import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhotosForRating, submitPhotoRating, getUserProfile } from '../api/photoRating';
import { Button, Card, Select, Slider, Space, Typography, message } from 'antd';
import '../styles/PhotoRatingPage.css';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * PhotoRatingPage component for displaying and rating photos with filters
 */
const PhotoRatingPage = () => {
  const queryClient = useQueryClient();

  // State for filters
  const [filters, setFilters] = useState({
    gender: '',
    minAge: 18,
    maxAge: 100,
  });

  // State for current photo index
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Query for user profile data (including points)
  const { data: profileData, isLoading: isProfileLoading } = useQuery(
    ['userProfile'],
    getUserProfile,
    {
      staleTime: 60000, // Cache for 1 minute
    }
  );

  // Query for photos based on filters
  const { data: photosData, isLoading, isError, refetch } = useQuery(
    ['photosForRating', filters],
    () => getPhotosForRating(filters),
    {
      staleTime: 30000, // Cache for 30 seconds
      enabled: true,
    }
  );

  // Mutation for submitting a rating
  const submitRatingMutation = useMutation(
    ({ photoId, rating }) => submitPhotoRating(photoId, rating),
    {
      onSuccess: () => {
        message.success('Оценка сохранена!');
        // Move to the next photo
        setCurrentPhotoIndex((prev) => prev + 1);
        // Invalidate user profile to update points
        queryClient.invalidateQueries(['userProfile']);
        // Refetch photos if we run out
        if (currentPhotoIndex + 1 >= photosData?.photos?.length) {
          refetch();
          setCurrentPhotoIndex(0);
        }
      },
      onError: () => {
        message.error('Ошибка при сохранении оценки');
      },
    }
  );

  // Handle filter changes
  const handleGenderChange = (value) => {
    setFilters((prev) => ({ ...prev, gender: value }));
    setCurrentPhotoIndex(0); // Reset photo index on filter change
  };

  const handleAgeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      minAge: value[0],
      maxAge: value[1],
    }));
    setCurrentPhotoIndex(0); // Reset photo index on filter change
  };

  // Handle rating submission
  const handleRatingSubmit = (rating) => {
    const currentPhoto = photosData?.photos[currentPhotoIndex];
    if (currentPhoto) {
      submitRatingMutation.mutate({ photoId: currentPhoto._id, rating });
    }
  };

  // Determine current photo to display
  const currentPhoto = photosData?.photos?.length > 0 && currentPhotoIndex < photosData.photos.length
    ? photosData.photos[currentPhotoIndex]
    : null;

  // Loading state
  if (isLoading || isProfileLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  // Error state
  if (isError) {
    return (
      <div className="error">
        <Title level={3}>Ошибка загрузки фотографий</Title>
        <Button onClick={() => refetch()}>Попробовать снова</Button>
      </div>
    );
  }

  return (
    <div className="photo-rating-container">
      <Title level={2}>Оценка фотографий</Title>
      <Text className="points-display">
        Ваши баллы: {profileData?.user?.points || 0}
      </Text>

      <Card title="Фильтры" className="filters-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text>Пол:</Text>
            <Select
              value={filters.gender}
              onChange={handleGenderChange}
              placeholder="Выберите пол"
              style={{ width: 200, marginLeft: 10 }}
            >
              <Option value="">Все</Option>
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
            </Select>
          </div>
          <div>
            <Text>Возраст:</Text>
            <Slider
              range
              min={18}
              max={100}
              value={[filters.minAge, filters.maxAge]}
              onChange={handleAgeChange}
              style={{ width: 300, marginLeft: 10 }}
            />
          </div>
        </Space>
      </Card>

      {currentPhoto ? (
        <Card className="photo-card" title="Оцените эту фотографию">
          <img
            src={currentPhoto.url}
            alt="Фото для оценки"
            className="rating-photo"
          />
          <Text className="photo-description">{currentPhoto.description}</Text>
          <Space className="rating-buttons">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                onClick={() => handleRatingSubmit(rating)}
                type="primary"
                shape="circle"
                size="large"
              >
                {rating}
              </Button>
            ))}
          </Space>
        </Card>
      ) : (
        <Card className="no-photos-card">
          <Title level={4}>Фотографии не найдены</Title>
          <Text>Попробуйте изменить фильтры или загрузить свои фотографии.</Text>
          <Button onClick={() => refetch()} style={{ marginTop: 16 }}>
            Обновить
          </Button>
        </Card>
      )}
    </div>
  );
};

export default PhotoRatingPage;
