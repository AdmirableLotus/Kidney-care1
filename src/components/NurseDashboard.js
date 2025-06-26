import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffDashboardV2.css';
import MedicationManager from './MedicationManager';
import FluidDashboard from './FluidDashboard';

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [foodEntries, setFoodEntries] = useState([]);
  const [totals, setTotals] = useState({
    protein: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0
  });
  const [user, setUser] = useState(null);
  const [newEntry, setNewEntry] = useState({
    meal: '',
    food: '',
    protein: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [entrySuccess, setEntrySuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      if (!['nurse', 'medical_staff', 'admin', 'doctor', 'dietitian'].includes(u.role)) {
        setError('Access denied. This dashboard is for medical staff only.');
        setLoading(false);
        return;
      }
    } else {
      setError('User not found in localStorage.');
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    console.log("User role:", user?.role);
    console.log("Selected patient:", selectedPatient);
  }, [user, selectedPatient]);

  const calculateTotals = (entries) => {
    return entries.reduce(
      (acc, entry) => {
        acc.protein += entry.protein || 0;
        acc.phosphorus += entry.phosphorus || 0;
        acc.potassium += entry.potassium || 0;
        acc.sodium += entry.sodium || 0;
        return acc;
      },
      { protein: 0, phosphorus: 0, potassium: 0, sodium: 0 }
    );
  };

  const handlePatientSelect = async (patient) => {
    if (selectedPatient?._id === patient._id) return;
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
      setTotals(calculateTotals(response.data));
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

    setSubmitting(true);
    setError('');
    setEntrySuccess(false);

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

      setEntrySuccess(true);
    } catch (err) {
      console.error('Failed to add food entry:', err);
      setError('Failed to add food entry: ' + (err.response?.data?.message || err.message));
    }

    setSubmitting(false);
  };

  if (loading) return <div style={{color:'red'}}>DEBUG: Loading nurse dashboard...</div>;
  if (error) return <div className="error-message" style={{color:'red'}}>DEBUG: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 style={{color: 'red', zIndex: 9999}}>DEBUG: Nurse Dashboard Loaded</h1>
      <h2>Nurse Dashboard</h2>
      
      <div className="patients-section">
        <h3>Your Patients</h3>
        {patients.length === 0 ? (
          <p style={{color:'orange'}}>No patients found. New patients will appear here when they register.</p>
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
                <button onClick={(e) => e.stopPropagation()} className="view-details-btn">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!selectedPatient && patients.length > 0 && (
        <div style={{color:'orange', marginTop:20}}>Select a patient to view their food log.</div>
      )}

      {selectedPatient && (
        <div className="patient-details">
          <h2>Food Log for {selectedPatient.name}</h2>
          <div className="totals">
            <p>Protein: {totals.protein} g</p>
            <p>Phosphorus: {totals.phosphorus} mg</p>
            <p>Potassium: {totals.potassium} mg</p>
            <p>Sodium: {totals.sodium} mg</p>
          </div>

          <form onSubmit={handleAddFoodEntry} className="food-entry-form">
            <input type="text" placeholder="Meal" value={newEntry.meal} onChange={e => setNewEntry({ ...newEntry, meal: e.target.value })} required />
            <input type="text" placeholder="Food Item" value={newEntry.food} onChange={e => setNewEntry({ ...newEntry, food: e.target.value })} required />
            <input type="number" placeholder="Protein (g)" value={newEntry.protein} onChange={e => setNewEntry({ ...newEntry, protein: Number(e.target.value) })} required />
            <input type="number" placeholder="Phosphorus (mg)" value={newEntry.phosphorus} onChange={e => setNewEntry({ ...newEntry, phosphorus: Number(e.target.value) })} required />
            <input type="number" placeholder="Potassium (mg)" value={newEntry.potassium} onChange={e => setNewEntry({ ...newEntry, potassium: Number(e.target.value) })} required />
            <input type="number" placeholder="Sodium (mg)" value={newEntry.sodium} onChange={e => setNewEntry({ ...newEntry, sodium: Number(e.target.value) })} required />
            <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Food Entry'}</button>
            {entrySuccess && <p className="success-message">Entry added successfully!</p>}
            {error && <p className="error-message">{error}</p>}
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
                    <p>Protein: {entry.protein} g</p>
                    <p>Phosphorus: {entry.phosphorus} mg</p>
                    <p>Potassium: {entry.potassium} mg</p>
                    <p>Sodium: {entry.sodium} mg</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <MedicationManager patientId={selectedPatient._id} />
          {console.log("Patient ID passed to MedicationManager:", selectedPatient?._id)}

          <FluidDashboard patientId={selectedPatient._id} />
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
