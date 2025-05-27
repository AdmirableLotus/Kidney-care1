import React, { useState } from "react";
import axios from "axios";

const FoodLogForm = ({ onEntryAdded }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    meal: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/patient/food",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({
        date: new Date().toISOString().split("T")[0],
        meal: "",
        description: "",
      });
      setSuccess("Food entry logged and nutrients calculated!");
      if (onEntryAdded) onEntryAdded();
    } catch (err) {
      setError("Failed to log food entry.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="food-log-form">
      <h3>Log Your Meal</h3>
      <label>Date: <input type="date" name="date" value={form.date} onChange={handleChange} required /></label>
      <label>Meal: <input type="text" name="meal" value={form.meal} onChange={handleChange} required /></label>
      <label>What did you eat? <input type="text" name="description" value={form.description} onChange={handleChange} required placeholder="e.g. 12 strawberries, 2 slices of cheese" /></label>
      <button type="submit" disabled={loading}>{loading ? "Logging..." : "Log Meal"}</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default FoodLogForm;
