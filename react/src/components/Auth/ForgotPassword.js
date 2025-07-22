import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setError(null);
    // Здесь должен быть запрос к API для восстановления пароля, но он пока не реализован на сервере
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={20} sm={16} md={12} lg={8}>
        <Card style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={2}>Восстановление пароля</Title>
            <Text>Введите ваш email для восстановления пароля</Text>
          </div>
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
          {success ? (
            <Alert
              message="Инструкции по восстановлению пароля отправлены на ваш email."
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          ) : (
            <Form
              name="forgotPassword"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Пожалуйста, введите ваш email!' }, { type: 'email', message: 'Некорректный формат email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  Отправить
                </Button>
              </Form.Item>
            </Form>
          )}
          <div style={{ textAlign: 'center' }}>
            <Text>
              Вернуться к <a href="/login">входу</a>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;