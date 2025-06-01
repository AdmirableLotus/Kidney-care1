import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Submitting registration form:', formData);
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('✅ Registration Success:', res.data);
      // Show success message before redirecting
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('❌ Registration Error:', err);
      let msg = 'Registration failed. ';
      if (err.response?.data?.message) msg += err.response.data.message;
      if (err.response?.data?.error) msg += ' ' + err.response.data.error;
      setError(msg);
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        />       <select name="role" value={formData.role} onChange={handleChange}>
  <option value="patient">Patient</option>
  <option value="doctor">Doctor</option>
  <option value="nurse">Nurse</option>
  <option value="dietitian">Dietitian</option>
  <option value="medical_staff">Medical Staff</option>
</select>
        <button type="submit">Sign Up</button>
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </form>
    </div>
  );
};

export default RegisterForm;
