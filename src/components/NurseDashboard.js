import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffDashboardV2.css';

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [foodEntries, setFoodEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    meal: '',
    food: '',
    protein: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0
  });

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

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    localStorage.setItem('selectedPatientId', patient._id);
    await fetchPatientFoodEntries(patient._id);
  };

  const fetchPatientFoodEntries = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/staff/patient/${patientId}/food`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodEntries(response.data);
    } catch (err) {
      console.error('Error fetching food entries:', err);
      setError('Failed to load food entries: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddFoodEntry = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const entryData = {
        meal: newEntry.meal,
        description: newEntry.food,
        protein: newEntry.protein,
        phosphorus: newEntry.phosphorus,
        potassium: newEntry.potassium,
        sodium: newEntry.sodium,
        date: new Date().toISOString()
      };

      await axios.post(
        `http://localhost:5000/api/staff/patient/${selectedPatient._id}/food`,
        entryData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      await fetchPatientFoodEntries(selectedPatient._id);

      setNewEntry({
        meal: '',
        food: '',
        protein: 0,
        phosphorus: 0,
        potassium: 0,
        sodium: 0
      });
    } catch (err) {
      console.error('Failed to add food entry:', err);
      alert('Failed to add food entry: ' + (err.response?.data?.message || err.message));
    }
  };

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
              <div 
                key={patient._id} 
                className={`patient-card ${selectedPatient?._id === patient._id ? 'selected' : ''}`}
                onClick={() => handlePatientSelect(patient)}
              >
                <h4>{patient.name}</h4>
                <p>Email: {patient.email}</p>
                <button 
                  onClick={(e) => e.stopPropagation()} // Placeholder
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="patient-details">
          <h2>Food Log for {selectedPatient.name}</h2>
          <form onSubmit={handleAddFoodEntry} className="food-entry-form">
            <input
              type="text"
              placeholder="Meal (e.g., Breakfast, Lunch)"
              value={newEntry.meal}
              onChange={e => setNewEntry({ ...newEntry, meal: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Food Item"
              value={newEntry.food}
              onChange={e => setNewEntry({ ...newEntry, food: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={newEntry.protein}
              onChange={e => setNewEntry({ ...newEntry, protein: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Phosphorus (mg)"
              value={newEntry.phosphorus}
              onChange={e => setNewEntry({ ...newEntry, phosphorus: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Potassium (mg)"
              value={newEntry.potassium}
              onChange={e => setNewEntry({ ...newEntry, potassium: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Sodium (mg)"
              value={newEntry.sodium}
              onChange={e => setNewEntry({ ...newEntry, sodium: Number(e.target.value) })}
              required
            />
            <button type="submit">Add Food Entry</button>
          </form>

          <div className="food-entries-list">
            {foodEntries.length === 0 ? (
              <p>No food entries found for this patient.</p>
            ) : (
              foodEntries.map(entry => (
                <div key={entry._id} className="food-entry-card">
                  <div className="entry-header">
                    <h3>{entry.meal}</h3>
                    <p>{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div className="entry-details">
                    <p>Food: {entry.description}</p>
                    <p>Protein: {entry.protein}g</p>
                    <p>Phosphorus: {entry.phosphorus}mg</p>
                    <p>Potassium: {entry.potassium}mg</p>
                    <p>Sodium: {entry.sodium}mg</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
