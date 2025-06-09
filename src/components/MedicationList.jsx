import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import MedicationForm from "./MedicationForm";
import "./Medication.css";

const MedicationList = () => {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMeds = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/patient/medication", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeds(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load medications.");
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeds(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/patient/medication/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeds(meds.filter(m => m._id !== id));
    } catch {
      alert("Failed to delete medication.");
    }
  };

  const handleMedicationAdded = () => {
    fetchMeds();
    setShowAddForm(false);
  };

  if (loading) return <p className="text-white">Loading medications...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="medication-list">
      <button 
        className="add-medication-toggle" 
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "− Cancel" : "+ Add Medication"}
      </button>
      
      {showAddForm && <MedicationForm onAdded={handleMedicationAdded} />}

      {meds.length === 0 ? (
        <p>No medications added yet.</p>
      ) : (
        <ul>
          {meds.map(med => (
            <li key={med._id}>
              <strong>{med.name}</strong> ({med.dosage})<br />
              Frequency: {med.frequency}<br />
              {med.time && med.time.length > 0 && (
                <>Time(s): {med.time.join(", ")}<br /></>
              )}
              Start: {format(new Date(med.startDate), "MMM d, yyyy")}<br />
              {med.endDate && (
                <>End: {format(new Date(med.endDate), "MMM d, yyyy")}<br /></>
              )}
              {med.notes && <em>Notes: {med.notes}</em>}
              <button onClick={() => handleDelete(med._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicationList;
