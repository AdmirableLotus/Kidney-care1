import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BloodPressureChart = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/patient/bloodpressure', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEntries(res.data);
      } catch (err) {
        setError('Failed to load blood pressure data.');
      }
      setLoading(false);
    };
    fetchEntries();
  }, []);

  if (loading) return <p>Loading blood pressure chart...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="bp-chart">
      <h3>Blood Pressure (Last 7 Entries)</h3>
      <table>
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Systolic</th>
            <th>Diastolic</th>
            <th>Pulse</th>
          </tr>
        </thead>
        <tbody>
          {entries.slice(0, 7).map((e) => (
            <tr key={e._id}>
              <td>{new Date(e.timestamp).toLocaleString()}</td>
              <td>{e.systolic}</td>
              <td>{e.diastolic}</td>
              <td>{e.pulse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BloodPressureChart;
