import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodPressureForm = ({ onEntryAdded }) => {
  const getCurrentTimestamp = () => {
    const now = new Date();
    now.setSeconds(0, 0); // Normalize to avoid millisecond noise
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  };

  const [form, setForm] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    timestamp: getCurrentTimestamp(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Auto-set current time when form loads
    setForm((prev) => ({ ...prev, timestamp: getCurrentTimestamp() }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/patient/bloodpressure', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('✅ Blood pressure entry added!');
      setForm({
        systolic: '',
        diastolic: '',
        pulse: '',
        timestamp: getCurrentTimestamp(),
      });
      if (onEntryAdded) onEntryAdded();
    } catch (err) {
      console.error('Error logging blood pressure:', err);
      setError('❌ Failed to add entry. Please try again.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bp-form space-y-4" aria-label="Blood Pressure Logging Form">
      <h3 className="text-lg font-semibold">Log Blood Pressure</h3>

      <label>
        Systolic:
        <input
          name="systolic"
          type="number"
          value={form.systolic}
          onChange={handleChange}
          min="50"
          max="250"
          required
        />
      </label>

      <label>
        Diastolic:
        <input
          name="diastolic"
          type="number"
          value={form.diastolic}
          onChange={handleChange}
          min="30"
          max="150"
          required
        />
      </label>

      <label>
        Pulse:
        <input
          name="pulse"
          type="number"
          value={form.pulse}
          onChange={handleChange}
          min="30"
          max="200"
        />
      </label>

      <label>
        Time:
        <input
          name="timestamp"
          type="datetime-local"
          value={form.timestamp}
          onChange={handleChange}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Entry'}
      </button>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </form>
  );
};

export default BloodPressureForm;
