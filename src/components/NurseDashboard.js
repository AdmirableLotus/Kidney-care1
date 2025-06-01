import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffDashboardV2.css';

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2>Nurse Dashboard</h2>
      <div className="patients-section">
        <h3>Your Patients</h3>
        {patients.length === 0 ? (
          <p>No patients found. New patients will appear here when they register.</p>
        ) : (
          <div className="patients-grid">
            {patients.map(patient => (
              <div key={patient._id} className="patient-card">
                <h4>{patient.name}</h4>
                <p>Email: {patient.email}</p>
                <button 
                  onClick={() => {/* TODO: Implement view patient details */}}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
