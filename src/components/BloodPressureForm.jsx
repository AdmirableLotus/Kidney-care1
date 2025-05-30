import React, { useState } from 'react';
import axios from 'axios';

const BloodPressureForm = ({ onEntryAdded }) => {
  const [form, setForm] = useState({ systolic: '', diastolic: '', pulse: '', timestamp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/patient/bloodpressure', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Blood pressure entry added!');
      setForm({ systolic: '', diastolic: '', pulse: '', timestamp: '' });
      if (onEntryAdded) onEntryAdded();
    } catch (err) {
      setError('Failed to add entry.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bp-form">
      <h3>Log Blood Pressure</h3>
      <label>Systolic: <input name="systolic" type="number" value={form.systolic} onChange={handleChange} required /></label>
      <label>Diastolic: <input name="diastolic" type="number" value={form.diastolic} onChange={handleChange} required /></label>
      <label>Pulse: <input name="pulse" type="number" value={form.pulse} onChange={handleChange} /></label>
      <label>Time: <input name="timestamp" type="datetime-local" value={form.timestamp} onChange={handleChange} /></label>
      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Entry'}</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default BloodPressureForm;
