import React from "react";
import StaffMedicationForm from "./StaffMedicationForm";

const StaffDashboard = () => {
  return (
    <div>
      <h2>
        Welcome, Medical Team{" "}
        <span role="img" aria-label="stethoscope">
          🩺
        </span>
      </h2>

      <p>This dashboard is for managing patient data, appointments, and reports.</p>

      <div style={{ marginTop: "20px" }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>View patient health logs</li>
          <li>Approve or flag symptom reports</li>
          <li>Export daily summaries</li>
        </ul>
      </div>

      <div style={{ marginTop: "40px" }}>
        <StaffMedicationForm />
      </div>
    </div>
  );
};

export default StaffDashboard;
