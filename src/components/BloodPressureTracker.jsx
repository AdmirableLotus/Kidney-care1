import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodPressureTracker = () => {
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    time: '',
  });
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getCurrentTimestamp = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/patient/bloodpressure', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReadings(sorted);
    } catch (err) {
      console.error('Failed to fetch blood pressure readings:', err);
      setError('Could not load readings.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const entry = {
        systolic: form.systolic,
        diastolic: form.diastolic,
        pulse: form.pulse,
        timestamp: form.time || new Date().toISOString(),
      };
      await axios.post('http://localhost:5000/api/patient/bloodpressure', entry, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReadings((prev) => [entry, ...prev]);
      setSuccess('✅ Entry saved');
      setForm({ systolic: '', diastolic: '', pulse: '', time: '' });
    } catch (err) {
      console.error('Failed to submit:', err);
      setError('❌ Could not save. Try again.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md" style={{ color: '#111' }}>
      <h2 className="text-xl font-bold mb-4">Log Blood Pressure</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Systolic (mmHg)</label>
          <input
            type="number"
            name="systolic"
            value={form.systolic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Diastolic (mmHg)</label>
          <input
            type="number"
            name="diastolic"
            value={form.diastolic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pulse (bpm)</label>
          <input
            type="number"
            name="pulse"
            value={form.pulse}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date & Time</label>
          <input
            type="datetime-local"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Add Reading
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      <div className="mt-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showHistory ? 'Hide History' : 'See History'}
        </button>
        {showHistory && readings.length > 0 && (
          <div className="mt-4 max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {readings.map((entry, idx) => (
                <li key={idx} className="border p-2 rounded text-sm">
                  {entry.systolic}/{entry.diastolic} mmHg, Pulse: {entry.pulse} @{' '}
                  {new Date(entry.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodPressureTracker;
