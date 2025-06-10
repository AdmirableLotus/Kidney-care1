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
        const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setEntries(sorted.slice(0, 7));
      } catch (err) {
        setError('Failed to load blood pressure data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (loading) return <p>Loading blood pressure chart...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (entries.length === 0) return <p>No blood pressure entries found.</p>;

  return (
    <div className="bp-chart">
      <h3 className="text-xl font-semibold mb-4">Blood Pressure (Last 7 Entries)</h3>
      <table className="w-full text-sm text-white bg-transparent border border-white/30">
        <thead>
          <tr className="bg-white/10">
            <th className="p-2 border-b">Date/Time</th>
            <th className="p-2 border-b">Systolic</th>
            <th className="p-2 border-b">Diastolic</th>
            <th className="p-2 border-b">Pulse</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e._id} className="text-center border-t border-white/20">
              <td className="p-2">{new Date(e.timestamp).toLocaleString()}</td>
              <td className="p-2">{e.systolic}</td>
              <td className="p-2">{e.diastolic}</td>
              <td className="p-2">{e.pulse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BloodPressureChart;
