import React, { useState } from 'react';
import './AuthModal.css';
import { login, register } from '../api';

export default function AuthModal({ closeModal }) {
  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const res = await login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        const res = await register({ name: formData.name, email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      closeModal();
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>&times;</button>
        <div className="tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
          <button className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Sign Up'}
          </button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

