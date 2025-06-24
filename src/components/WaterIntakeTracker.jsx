import React, { useState } from 'react';

const WaterIntakeTracker = () => {
  const [intakes, setIntakes] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    unit: 'ml',
    container: '',
    type: '',
  });
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIntakes([...intakes, { ...form, timestamp: new Date().toISOString() }]);
    setForm({ amount: '', unit: 'ml', container: '', type: '' });
  };

  return (
    <div className="flex justify-end p-4">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Log Water Intake</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="ml">Milliliters (ml)</option>
              <option value="oz">Ounces (oz)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Container</label>
            <select
              name="container"
              value={form.container}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select container</option>
              <option value="cup">Cup</option>
              <option value="glass">Glass</option>
              <option value="bottle">Bottle</option>
              <option value="mug">Mug</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Type of Drink</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select drink</option>
              <option value="water">Water</option>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="milk">Milk</option>
              <option value="juice">Juice</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Add Intake
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showHistory ? 'Hide History' : 'See History'}
          </button>

          {showHistory && intakes.length > 0 && (
            <div className="mt-4 max-h-48 overflow-y-auto">
              <ul className="space-y-2">
                {intakes.map((entry, idx) => (
                  <li key={idx} className="border p-2 rounded text-sm">
                    {entry.amount} {entry.unit} - {entry.type} in a {entry.container} @ {new Date(entry.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterIntakeTracker;
