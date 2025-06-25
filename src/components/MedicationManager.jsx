import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MedicationManager.css';

const MedicationManager = ({ patientId }) => {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    notes: ''
  });

  useEffect(() => {
    // Fetch medications for the patient
    axios.get(`/api/patients/${patientId}/medications`)
      .then(response => setMedications(response.data))
      .catch(error => console.error('Error fetching medications:', error));
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMedication = () => {
    axios.post(`/api/patients/${patientId}/medications`, formData)
      .then(response => {
        setMedications([...medications, response.data]);
        setFormData({ name: '', dosage: '', frequency: '', notes: '' });
      })
      .catch(error => console.error('Error adding medication:', error));
  };

  const handleDeleteMedication = (medId) => {
    axios.delete(`/api/medications/${medId}`)
      .then(() => {
        setMedications(medications.filter(med => med._id !== medId));
      })
      .catch(error => console.error('Error deleting medication:', error));
  };

  return (
    <div className="medication-manager">
      <h2>Manage Medications</h2>

      <div className="medication-form">
        <input
          type="text"
          name="name"
          placeholder="Medication Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="frequency"
          placeholder="Frequency"
          value={formData.frequency}
          onChange={handleInputChange}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={handleAddMedication} className="primary-btn">Add Medication</button>
      </div>

      <div className="medication-list">
        <h3>Current Medications</h3>
        {medications.map(med => (
          <div key={med._id} className="medication-item">
            <p><strong>{med.name}</strong></p>
            <p>Dosage: {med.dosage}</p>
            <p>Frequency: {med.frequency}</p>
            <p>Notes: {med.notes}</p>
            <button onClick={() => handleDeleteMedication(med._id)} className="secondary-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationManager;
