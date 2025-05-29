import React, { useState } from "react";
import axios from "axios";

const MedicationForm = ({ onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/patient/medication",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({
        name: "",
        dosage: "",
        frequency: "",
        notes: "",
      });
      if (onAdded) onAdded();
    } catch (err) {
      setError("Failed to add medication.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="medication-form">
      <h3>Add Medication</h3>
      <label>Name: <input name="name" value={form.name} onChange={handleChange} required /></label>
      <label>Dosage: <input name="dosage" value={form.dosage} onChange={handleChange} required /></label>
      <label>Frequency: <input name="frequency" value={form.frequency} onChange={handleChange} required placeholder="e.g. Once daily" /></label>
      <label>Notes: <input name="notes" value={form.notes} onChange={handleChange} /></label>
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Medication"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default MedicationForm;
