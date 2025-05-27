import React, { useState } from "react";
import axios from "axios";

const FoodLogForm = ({ onEntryAdded }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    meal: "",
    protein: "",
    phosphorus: "",
    sodium: "",
    potassium: "",
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
        "http://localhost:5000/api/patient/food",
        {
          ...form,
          protein: Number(form.protein),
          phosphorus: Number(form.phosphorus),
          sodium: Number(form.sodium),
          potassium: Number(form.potassium),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({
        date: new Date().toISOString().split("T")[0],
        meal: "",
        protein: "",
        phosphorus: "",
        sodium: "",
        potassium: "",
      });
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
      <label>Protein (g): <input type="number" name="protein" value={form.protein} onChange={handleChange} required /></label>
      <label>Phosphorus (mg): <input type="number" name="phosphorus" value={form.phosphorus} onChange={handleChange} required /></label>
      <label>Sodium (mg): <input type="number" name="sodium" value={form.sodium} onChange={handleChange} required /></label>
      <label>Potassium (mg): <input type="number" name="potassium" value={form.potassium} onChange={handleChange} required /></label>
      <button type="submit" disabled={loading}>{loading ? "Logging..." : "Log Meal"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default FoodLogForm;
