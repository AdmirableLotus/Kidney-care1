import React, { useState } from "react";
import axios from "axios";
import "./Medication.css";

const MedicationForm = ({ onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
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
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = {
        ...form,
        time: form.time ? form.time.split(",").map((t) => t.trim()) : [],
      };

      await axios.post(
        "http://localhost:5000/api/patient/medication",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({
        name: "",
        dosage: "",
        frequency: "",
        time: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        notes: "",
      });

      if (onAdded) onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add medication.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="medication-form">
      <h3>Add New Medication</h3>

      <label>
        Medication Name:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Lisinopril"
        />
      </label>

      <label>
        Dosage:
        <input
          type="text"
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          required
          placeholder="e.g. 10mg"
        />
      </label>

      <label>
        Frequency:
        <input
          type="text"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          required
          placeholder="e.g. Once daily"
        />
      </label>

      <label>
        Time(s):
        <input
          type="text"
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="e.g. 8:00 AM, 8:00 PM"
        />
      </label>

      <label>
        Start Date:
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        End Date:
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          min={form.startDate}
        />
      </label>

      <label>
        Notes:
        <input
          type="text"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Any special instructions or notes"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Medication"}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default MedicationForm;

