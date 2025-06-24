import React, { useState } from 'react';

const BloodPressureTracker = () => {
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    time: '',
  });
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReadings([
      ...readings,
      { ...form, timestamp: form.time || new Date().toISOString() },
    ]);
    setForm({ systolic: '', diastolic: '', pulse: '', time: '' });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md" style={{color:'#111'}}>
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
            placeholder="e.g. 120"
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
            placeholder="e.g. 80"
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
            placeholder="e.g. 70"
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
                  {entry.systolic}/{entry.diastolic} mmHg, Pulse: {entry.pulse} @ {new Date(entry.timestamp).toLocaleString()}
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
