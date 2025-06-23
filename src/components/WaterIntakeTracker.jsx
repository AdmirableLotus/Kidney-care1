import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';

export default function WaterIntakeTracker() {
  const [form, setForm] = useState({
    amount: '',
    unit: 'ml',
    container: 'glass',
    drinkType: 'water',
    timestamp: new Date().toISOString().slice(0, 16),
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
    <div className="water-intake-tracker">
      <Card className="p-4 bg-white/10 backdrop-blur rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">💧 Log Fluid Intake</h2>
          <form onSubmit={handleSubmit} aria-label="Log Fluid Intake" className="grid grid-cols-2 gap-4">
            <label htmlFor="amount" className="sr-only">Amount</label>
            <input type="number" id="amount" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required min="1" className="p-2 rounded" />
            
            <label htmlFor="unit" className="sr-only">Unit</label>
            <select id="unit" name="unit" value={form.unit} onChange={handleChange} className="p-2 rounded">
              <option value="ml">mL</option>
              <option value="oz">oz</option>
            </select>
            
            <label htmlFor="container" className="sr-only">Container</label>
            <select id="container" name="container" value={form.container} onChange={handleChange} className="p-2 rounded col-span-2">
              <option value="glass">Glass</option>
              <option value="mug">Mug</option>
              <option value="bottle">Bottle</option>
              <option value="cup">Cup</option>
              <option value="can">Can</option>
            </select>
            
            <label htmlFor="drinkType" className="sr-only">Drink Type</label>
            <select id="drinkType" name="drinkType" value={form.drinkType} onChange={handleChange} className="p-2 rounded col-span-2">
              <option value="water">Water</option>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="juice">Juice</option>
              <option value="milk">Milk</option>
              <option value="soda">Soda</option>
            </select>
            
            <label htmlFor="timestamp" className="sr-only">Date & Time</label>
            <input type="datetime-local" id="timestamp" name="timestamp" value={form.timestamp} onChange={handleChange} className="p-2 rounded col-span-2" />
            
            <button type="submit" className="col-span-2 p-2 bg-blue-500 text-white rounded">Add Entry</button>
          </form>
        </CardContent>
      </Card>

      <Card className="p-4 bg-white/10 backdrop-blur rounded-2xl mt-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">📊 Intake History</h2>
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry._id} className="border-b border-white/20 pb-2">
                {new Date(entry.timestamp).toLocaleString()} — {entry.amount} {entry.unit} from a {entry.container} of {entry.drinkType}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
