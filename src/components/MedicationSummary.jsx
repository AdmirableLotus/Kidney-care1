import React, { useState, useEffect } from "react";
import axios from "axios";

const MedicationSummary = ({ patientId }) => {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/patients/${patientId}/medications`)
      .then((res) => setMedications(res.data))
      .catch((err) => console.error("Failed to fetch medications:", err));
  }, [patientId]);

  return (
    <div>
      <h3>Medications</h3>
      {medications.length > 0 ? (
        medications.map((med) => (
          <div key={med._id}>
            <strong>{med.name}</strong>: {med.dosage} – {med.frequency}
          </div>
        ))
      ) : (
        <p>No medications recorded.</p>
      )}
    </div>
  );
};

export default MedicationSummary;
