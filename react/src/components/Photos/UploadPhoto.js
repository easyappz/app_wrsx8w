import React, { useState, useEffect } from 'react';
import { Button, Upload, Input, message, List, Switch, Card, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto, getMyPhotos, togglePhotoActive } from '../../api/photos';
import './UploadPhoto.css';

const UploadPhoto = () => {
  const [fileList, setFileList] = useState([]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch user's photos on component mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getMyPhotos();
      setPhotos(data.photos || []);
    } catch (error) {
      message.error('Ошибка при загрузке фотографий');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!fileList.length || !description) {
      message.error('Пожалуйста, выберите файл и добавьте описание');
      return;
    }

    setUploading(true);
    try {
      // This is a mock for file upload. In a real app, you would upload the file to a server or cloud storage
      // and get a URL to send to the API.
      const mockUrl = URL.createObjectURL(fileList[0].originFileObj);
      const data = {
        url: mockUrl,
        description,
      };
      await uploadPhoto(data);
      message.success('Фотография успешно загружена');
      setFileList([]);
      setDescription('');
      fetchPhotos(); // Refresh the photo list
    } catch (error) {
      message.error('Ошибка при загрузке фотографии');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (photoId, checked) => {
    try {
      await togglePhotoActive(photoId);
      message.success(checked ? 'Фотография активирована для оценки' : 'Фотография деактивирована');
      fetchPhotos(); // Refresh the photo list
    } catch (error) {
      message.error('Ошибка при изменении статуса фотографии');
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    accept: 'image/*',
  };

  return (
    <div className="upload-photo-container">
      <Card title="Загрузка фотографии" style={{ marginBottom: 24 }}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Выбрать фотографию</Button>
        </Upload>
        <Input
          placeholder="Описание фотографии"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0 || !description}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </Card>

      <Card title="Мои фотографии">
        {loading ? (
          <Spin />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={photos}
            renderItem={(item) => (
              <List.Item
                actions={
                  <Switch
                    checked={item.isActive}
                    onChange={(checked) => handleToggleActive(item._id, checked)}
                    checkedChildren="Активно"
                    unCheckedChildren="Неактивно"
                  />
                }
              >
                <List.Item.Meta
                  avatar={<img src={item.url} alt={item.description} style={{ width: 100, height: 100, objectFit: 'cover' }} />}
                  title={item.description}
                  description={`Статус: ${item.isActive ? 'Активно для оценки' : 'Неактивно'}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default UploadPhoto;
