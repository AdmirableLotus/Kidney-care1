import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Placeholder for authentication logic
    // Replace this with actual authentication API call
    if (email && password) {
      if (role === 'patient') {
        navigate('/dashboard/patient');
      } else {
        navigate('/dashboard/staff');
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Role:
          <select value={role} onChange={handleRoleChange}>
            <option value="patient">Patient</option>
            <option value="dietitian">Dietitian</option>
            <option value="social_worker">Social Worker</option>
            <option value="nephrologist">Nephrologist</option>
            <option value="primary_care_doctor">Primary Care Doctor</option>
            <option value="transplant_team_member">Transplant Team Member</option>
          </select>
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
