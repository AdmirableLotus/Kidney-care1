import React, { useState } from 'react';
import { logWater } from '../api';
import './WaterIntakeForm.css';

const WaterIntakeForm = ({ onLogSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogWater = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const ml = Number(amount);
      if (isNaN(ml) || ml <= 0) {
        throw new Error('Please enter a valid positive number.');
      }

      await logWater(ml);
      setSuccess('Water intake logged successfully!');
      setAmount('');
      if (onLogSuccess) onLogSuccess();
    } catch (err) {
      console.error('Logging water error:', err);
      setError(err.message || 'Error logging water intake.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogWater} className="water-intake-form">
      <h2><span role="img" aria-label="water droplet">💧</span> Track Your Water Intake</h2>
      <div className="form-group">
        <label htmlFor="water-amount">Amount (ml):</label>
        <input
          id="water-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in ml"
          min="1"
          required
        />
      </div>
      <button type="submit" disabled={loading || !amount}>
        {loading ? 'Logging...' : 'Log Water'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
};

export default WaterIntakeForm;
