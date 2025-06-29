import React, { useState } from "react";
import axios from "axios";
import "./MedicationForm.css";

const MedicationForm = ({ onAdded, patientId }) => {
  const [form, setForm] = useState({
    name: "",
    frequency: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      setError("No patient selected.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = {
        ...form,
      };

      const res = await axios.post(
        `http://localhost:5000/api/staff/patients/${patientId}/medications`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Medication added:", res.data);

      setForm({
        name: "",
        frequency: "",
        notes: "",
      });

      if (onAdded) onAdded();
    } catch (err) {
      console.error("❌ Medication submit error:", err);
      setError(err.response?.data?.message || "Failed to add medication.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="medication-form">
      <h3>Add New Medication</h3>

      <div className="form-group">
        <label htmlFor="name">Medication Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Lisinopril"
        />
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Frequency:</label>
        <input
          type="text"
          id="frequency"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          required
          placeholder="e.g. Once daily"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Any special instructions or notes"
        ></textarea>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Adding..." : "Add Medication"}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default MedicationForm;
