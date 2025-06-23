import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WaterIntakeTracker() {
  const [form, setForm] = useState({
    amount: '',
    unit: 'ml',
    container: 'glass',
    drinkType: 'water',
    timestamp: new Date().toISOString().slice(0, 16), // 24-hour format
  });
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/patient/water', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntries(res.data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/api/patient/water', form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ ...form, amount: '', timestamp: new Date().toISOString().slice(0, 16) });
    fetchEntries();
  };

  return (
    <div className="water-intake-tracker-wrapper">
      <div className="water-intake-tracker">
        <div className="dashboard-card">
          <div className="card-content">
            <h2>💧 Log Fluid Intake</h2>
            <form onSubmit={handleSubmit} aria-label="Log Fluid Intake">
              <label htmlFor="amount" className="sr-only">Amount</label>
              <input type="number" id="amount" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required min="1" />
              <label htmlFor="unit" className="sr-only">Unit</label>
              <select id="unit" name="unit" value={form.unit} onChange={handleChange}>
                <option value="ml">mL</option>
                <option value="oz">oz</option>
              </select>
              <label htmlFor="container" className="sr-only">Container</label>
              <select id="container" name="container" value={form.container} onChange={handleChange}>
                <option value="glass">Glass</option>
                <option value="mug">Mug</option>
                <option value="bottle">Bottle</option>
                <option value="cup">Cup</option>
                <option value="can">Can</option>
              </select>
              <label htmlFor="drinkType" className="sr-only">Drink Type</label>
              <select id="drinkType" name="drinkType" value={form.drinkType} onChange={handleChange}>
                <option value="water">Water</option>
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="juice">Juice</option>
                <option value="milk">Milk</option>
                <option value="soda">Soda</option>
              </select>
              <label htmlFor="timestamp" className="sr-only">Date & Time</label>
              <input
                type="datetime-local"
                id="timestamp"
                name="timestamp"
                value={form.timestamp}
                onChange={handleChange}
                step="60"
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
              />
              <button type="submit" className="btn">Add Entry</button>
            </form>
          </div>
        </div>
        <div className="dashboard-card" style={{marginTop: '1.5rem'}}>
          <div className="card-content">
            <h2>📊 Intake History</h2>
            <ul>
              {entries.map((entry) => (
                <li key={entry._id}>
                  {new Date(entry.timestamp).toLocaleString()} — {entry.amount} {entry.unit} from a {entry.container} of {entry.drinkType}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
