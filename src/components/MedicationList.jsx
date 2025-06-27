import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import MedicationForm from "./MedicationForm";
import "./Medication.css";

const MedicationList = ({ patientId }) => {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [commentState, setCommentState] = useState({});
  const [savingState, setSavingState] = useState({});

  const fetchMeds = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/patients/${patientId}/medications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeds(res.data);
    } catch (err) {
      setError("Failed to load medications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchMeds();
  }, [patientId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/medications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeds(meds.filter((m) => m._id !== id));
    } catch {
      alert("Failed to delete medication.");
    }
  };

  const handleMedicationAdded = () => {
    fetchMeds();
    setShowAddForm(false);
  };

  const handleCommentChange = (id, value) => {
    setCommentState((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentUpdate = async (id) => {
    setSavingState((prev) => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/medications/${id}/comment`,
        { comment: commentState[id] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMeds();
      setCommentState((prev) => ({ ...prev, [id]: "" }));
    } catch {
      alert("Failed to update comment.");
    }
    setSavingState((prev) => ({ ...prev, [id]: false }));
  };

  if (loading) return <p className="text-white">Loading medications...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="medication-list">
      <h2>Medications</h2>

      <button className="add-medication-toggle" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "− Cancel" : "+ Add Medication"}
      </button>

      {showAddForm && <MedicationForm onAdded={handleMedicationAdded} patientId={patientId} />}

      {meds.length === 0 ? (
        <p>No medications added yet.</p>
      ) : (
        <ul>
          {meds.map((med) => (
            <li key={med._id}>
              <strong>{med.name}</strong> ({med.dosage})<br />
              Frequency: {med.frequency}<br />
              {med.time?.length > 0 && <>Time(s): {med.time.join(", ")}<br /></>}
              Start: {format(new Date(med.startDate), "MMM d, yyyy")}<br />
              {med.endDate && <>End: {format(new Date(med.endDate), "MMM d, yyyy")}<br /></>}
              {med.notes && <em>Notes: {med.notes}</em>}
              
              <div style={{ marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Add a comment about this medication..."
                  value={commentState[med._id] || ""}
                  onChange={(e) => handleCommentChange(med._id, e.target.value)}
                  style={{ width: "70%" }}
                />
                <button
                  onClick={() => handleCommentUpdate(med._id)}
                  disabled={
                    savingState[med._id] || !(commentState[med._id] && commentState[med._id].trim())
                  }
                  style={{ marginLeft: 8 }}
                >
                  {savingState[med._id] ? "Saving..." : "Save Comment"}
                </button>
              </div>

              <button onClick={() => handleDelete(med._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicationList;
