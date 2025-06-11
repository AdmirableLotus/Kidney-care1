import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css'; // same styles used for consistency

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Submitting registration form:', formData);
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('✅ Registration Success:', res.data);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('❌ Registration Error:', err);
      let msg = 'Registration failed.';
      if (err.response?.data?.message) msg += ` ${err.response.data.message}`;
      if (err.response?.data?.error) msg += ` ${err.response.data.error}`;
      setError(msg);
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Register</h2>

        {error && <p className="error" role="alert">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-label="Full Name"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-label="Email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          aria-label="Password"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          aria-label="Select role"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="dietitian">Dietitian</option>
          <option value="medical_staff">Medical Staff</option>
        </select>

        <button type="submit">Sign Up</button>

        <p>
          Already have an account?{' '}
          <Link to="/login" aria-label="Go to Login Page">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
