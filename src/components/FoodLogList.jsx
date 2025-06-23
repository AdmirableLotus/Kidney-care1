import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const FoodLogList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/patient/food", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(response.data);
      } catch (err) {
        setError("Failed to load food log.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/patient/food/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      alert("Failed to delete entry.");
    }
  };

  if (loading) return <p>Loading food log...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="food-log-list">
      <h3>Food Log</h3>
      <ul>
        {entries.map((entry) => {
          let dateStr = "";
          try {
            dateStr = entry.dateConsumed ? format(new Date(entry.dateConsumed), "MMM d, yyyy") : "N/A";
          } catch {
            dateStr = "Invalid date";
          }
          return (
            <li key={entry._id} className="food-log-item" style={{ marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #ccc" }}>
              <strong>{dateStr}</strong> – {entry.mealType || "Meal"}
              <br />
              <em>{entry.foodName || "No food name"}</em>
              <div style={{ marginTop: "0.5rem" }}>
                <span>Protein: {entry.protein}g, </span>
                <span>Phosphorus: {entry.phosphorus}mg, </span>
                <span>Sodium: {entry.sodium}mg, </span>
                <span>Potassium: {entry.potassium}mg</span>
              </div>
              <button
                onClick={() => handleDelete(entry._id)}
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FoodLogList;
