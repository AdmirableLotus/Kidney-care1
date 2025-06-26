import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MedicationSummary.css";

const MedicationSummary = ({ patientId }) => {
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/patients/${patientId}/medications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMedications(response.data);
      } catch (err) {
        console.error("Failed to fetch medications:", err);
        setError("Unable to fetch medications. Please try again later.");
      }
    };

    fetchMedications();
  }, [patientId]);

  return (
    <div className="medication-summary">
      <h3>Medications</h3>
      {error ? (
        <p className="error">{error}</p>
      ) : medications.length > 0 ? (
        <ul>
          {medications.map((med) => (
            <li key={med._id}>
              <strong>{med.name}</strong>: {med.dosage} – {med.frequency}
              <p>{med.notes}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No medications recorded.</p>
      )}
    </div>
  );
};

export default MedicationSummary;
