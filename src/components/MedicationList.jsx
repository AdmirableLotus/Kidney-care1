import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const MedicationList = () => {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (!window.confirm("Delete this medication?")) return;
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

  if (loading) return <p>Loading medications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="medication-list">
      <h3>Your Medications</h3>
      <ul>
        {meds.map(med => (
          <li key={med._id}>
            <strong>{med.name}</strong> ({med.dosage})<br />
            Frequency: {med.frequency}<br />
            Time(s): {med.time && med.time.join(', ')}<br />
            Start: {format(new Date(med.startDate), "MMM d, yyyy")}<br />
            {med.endDate && <>End: {format(new Date(med.endDate), "MMM d, yyyy")}<br /></>}
            {med.notes && <em>Notes: {med.notes}</em>}<br />
            <button onClick={() => handleDelete(med._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationList;
