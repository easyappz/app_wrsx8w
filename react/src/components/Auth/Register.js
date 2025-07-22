import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { register } from '../../api/auth';

const { Title, Text } = Typography;

const Register = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({
        email: values.email,
        password: values.password,
        username: values.username,
      });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={20} sm={16} md={12} lg={8}>
        <Card style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={2}>Регистрация</Title>
            <Text>Создайте новый аккаунт</Text>
          </div>
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Имя пользователя"
              rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Пожалуйста, введите ваш email!' }, { type: 'email', message: 'Некорректный формат email!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }, { min: 6, message: 'Пароль должен содержать минимум 6 символов!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Подтвердите пароль"
              dependencies={['password']}
              rules={[{ required: true, message: 'Пожалуйста, подтвердите пароль!' }, ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              })]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                Зарегистрироваться
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text>
                Уже есть аккаунт? <a href="/login">Войти</a>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;