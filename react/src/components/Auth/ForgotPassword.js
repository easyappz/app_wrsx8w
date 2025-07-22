import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (email) {
      setSuccess('Инструкции по восстановлению пароля отправлены на ваш email.');
      setEmail('');
    } else {
      setError('Пожалуйста, введите ваш email.');
    }
  };

  return (
    <div className="App card">
      <h2>Восстановление пароля</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Отправить</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <p>
        Вернуться к <Link to="/login">входу</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
