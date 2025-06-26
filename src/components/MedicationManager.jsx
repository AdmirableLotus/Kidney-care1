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

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching medications for patientId:", patientId);
      const response = await axios.get(`/api/patients/${patientId}/medications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Medications fetched:", response.data);
      setMedications(response.data);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  useEffect(() => {
    console.log("Patient ID passed to MedicationManager:", patientId);
    if (patientId) fetchMedications();
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Adding medication with data:", formData);
      console.log("Medication POST request URL:", `/api/patients/${patientId}/medications`);
      console.log("Medication POST request headers:", { Authorization: `Bearer ${token}` });
      console.log("Medication POST request body:", formData);
      const response = await axios.post(`/api/patients/${patientId}/medications`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Medication added successfully:", response.data);
      setMedications([...medications, response.data]);
      setFormData({ name: '', dosage: '', frequency: '', notes: '' });
    } catch (error) {
      console.error('Error adding medication:', error);
      console.log("Error details:", error.response?.data);
    }
  };

  const handleDeleteMedication = async (medId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/medications/${medId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(medications.filter(med => med._id !== medId));
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const handleEdit = (med) => {
    setEditingId(med._id);
    setEditData({ ...med });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateMedication = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/medications/${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMedications(medications.map(med =>
        med._id === editingId ? response.data : med
      ));
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  return (
    <div className="medication-manager">
      <h2>Manage Medications</h2>

      <div className="medication-form">
        <input name="name" placeholder="Medication Name" value={formData.name} onChange={handleInputChange} />
        <input name="dosage" placeholder="Dosage" value={formData.dosage} onChange={handleInputChange} />
        <input name="frequency" placeholder="Frequency" value={formData.frequency} onChange={handleInputChange} />
        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleInputChange}></textarea>
        <button onClick={handleAddMedication} className="primary-btn">Add Medication</button>
      </div>

      <div className="medication-list">
        <h3>Current Medications</h3>
        {medications.map((med) => (
          <div key={med._id} className="medication-item">
            {editingId === med._id ? (
              <>
                <input name="name" value={editData.name} onChange={handleEditChange} />
                <input name="dosage" value={editData.dosage} onChange={handleEditChange} />
                <input name="frequency" value={editData.frequency} onChange={handleEditChange} />
                <textarea name="notes" value={editData.notes} onChange={handleEditChange} />
                <button onClick={handleUpdateMedication} className="primary-btn">Save</button>
                <button onClick={() => setEditingId(null)} className="secondary-btn">Cancel</button>
              </>
            ) : (
              <>
                <p><strong>{med.name}</strong></p>
                <p>Dosage: {med.dosage}</p>
                <p>Frequency: {med.frequency}</p>
                <p>Notes: {med.notes}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <button onClick={() => handleEdit(med)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteMedication(med._id)} className="secondary-btn">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationManager;
