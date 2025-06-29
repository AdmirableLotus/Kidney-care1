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
    <div className="food-log-list bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Food Log</h3>
      <ul className="space-y-4">
        {entries.map((entry) => {
          let dateStr = "";
          try {
            dateStr = entry.dateConsumed ? format(new Date(entry.dateConsumed), "MMM d, yyyy") : "N/A";
          } catch {
            dateStr = "Invalid date";
          }
          return (
            <li
              key={entry._id}
              className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="mb-2">
                <strong className="text-blue-700">{dateStr}</strong> – <span className="text-gray-700">{entry.mealType || "Meal"}</span>
              </div>
              <div className="text-lg font-medium text-gray-900">{entry.foodName || "No food name"}</div>
              <div className="text-sm text-gray-700 mt-2">
                <span className="mr-2"><span role="img" aria-label="Protein">🥩</span> Protein: {entry.protein}g</span>
                <span className="mr-2"><span role="img" aria-label="Phosphorus">🦴</span> Phosphorus: {entry.phosphorus}mg</span>
                <span className="mr-2"><span role="img" aria-label="Sodium">🧂</span> Sodium: {entry.sodium}mg</span>
                <span><span role="img" aria-label="Potassium">🍌</span> Potassium: {entry.potassium}mg</span>
              </div>
              <button
                onClick={() => handleDelete(entry._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
