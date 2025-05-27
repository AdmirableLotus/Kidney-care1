import React, { useState } from 'react';
import axios from 'axios';

const WaterIntakeForm = ({ onLogSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogWater = async () => {
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/patient/water',
        { amount: parseInt(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Water intake logged successfully!');
      setAmount('');
      if (onLogSuccess) onLogSuccess();
      console.log('✅ Logged water intake:', response.data);
    } catch (err) {
      console.error('❌ Logging water error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error logging water intake.');
    }
  };

  return (
    <div>
      <h2>💧 Track Your Water Intake</h2>
      <label>Amount (ml):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in ml"
      />
      <button onClick={handleLogWater}>Log Water</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default WaterIntakeForm;
