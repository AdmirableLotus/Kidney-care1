import React, { useState, useEffect } from "react";
import axios from "axios";
import "./medicationmanager.css";

const MedicationManager = ({ patientId }) => {
  const [meds, setMeds] = useState([]);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
    feedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMeds = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/patients/${patientId}/medications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMeds(res.data);
    } catch (err) {
      setError("Failed to load medications");
    }
  };

  useEffect(() => {
    if (patientId) fetchMeds();
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMed((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        ...newMed,
        time: newMed.time ? newMed.time.split(",").map((t) => t.trim()) : [],
      };

      await axios.post(
        `http://localhost:5000/api/patients/${patientId}/medications`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewMed({
        name: "",
        dosage: "",
        frequency: "",
        time: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        notes: "",
        feedback: "",
      });

      fetchMeds();
    } catch (err) {
      setError("Failed to add medication");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medication?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/medications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMeds();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="medication-manager">
      <h2>Manage Medications</h2>
      <form onSubmit={handleAddMedication} className="medication-form">
        <input
          name="name"
          placeholder="Name"
          value={newMed.name}
          onChange={handleInputChange}
          required
        />
        <input
          name="dosage"
          placeholder="Dosage"
          value={newMed.dosage}
          onChange={handleInputChange}
          required
        />
        <input
          name="frequency"
          placeholder="Frequency"
          value={newMed.frequency}
          onChange={handleInputChange}
          required
        />
        <input
          name="time"
          placeholder="Time(s), comma separated"
          value={newMed.time}
          onChange={handleInputChange}
        />
        <input
          name="startDate"
          type="date"
          value={newMed.startDate}
          onChange={handleInputChange}
        />
        <input
          name="endDate"
          type="date"
          value={newMed.endDate}
          onChange={handleInputChange}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={newMed.notes}
          onChange={handleInputChange}
        />
        <textarea
          name="feedback"
          placeholder="Patient Feedback"
          value={newMed.feedback}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Medication"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <div className="medication-list">
        {meds.map((med) => (
          <div key={med._id} className="medication-item">
            <p>
              <strong>{med.name}</strong> ({med.dosage}) - {med.frequency}
            </p>
            {med.time?.length > 0 && <p>Time: {med.time.join(", ")}</p>}
            <p>
              {med.startDate} to {med.endDate || "Ongoing"}
            </p>
            {med.notes && <p>📝 Notes: {med.notes}</p>}
            {med.feedback && <p>💬 Patient Feedback: {med.feedback}</p>}
            <button className="secondary-btn" onClick={() => handleDelete(med._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationManager;

