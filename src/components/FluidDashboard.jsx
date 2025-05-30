import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FluidDashboard({ patientId }) {
  const [fluidData, setFluidData] = useState({ totals: [], overall: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/fluids/totals/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFluidData(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load fluid data.');
      }
      setLoading(false);
    };
    fetchData();
  }, [patientId]);

  const getByType = (type) => {
    return fluidData.totals.find(t => t._id === type)?.totalMl || 0;
  };

  const fluidLimit = 1500;

  if (!patientId) return null;
  if (loading) return <div>Loading fluid dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full text-black">
      <h2 className="text-xl font-bold mb-4">💧 Fluid Intake Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <p className="font-semibold">Drinks</p>
          <p className="text-2xl">{getByType("drink")} mL</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="font-semibold">From Food</p>
          <p className="text-2xl">{getByType("food")} mL</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Total</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              fluidData.overall > fluidLimit ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min((fluidData.overall / fluidLimit) * 100, 100)}%` }}
          />
        </div>
        <p className="text-sm mt-1">{fluidData.overall} mL / {fluidLimit} mL</p>
        {fluidData.overall > fluidLimit && (
          <div className="text-red-600 font-bold mt-2">⚠️ Daily fluid limit exceeded!</div>
        )}
      </div>
    </div>
  );
}
