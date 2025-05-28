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
        const res = await axios.get("http://localhost:5000/api/patient/food", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load food log.");
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (loading) return <p>Loading food log...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="food-log-list">
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <strong>{format(new Date(entry.date), "MMM d, yyyy")}</strong>: {entry.meal} <br />
            <em>{entry.description}</em>
            <div>
              Protein: {entry.protein}g, Phosphorus: {entry.phosphorus}mg, Sodium: {entry.sodium}mg, Potassium: {entry.potassium}mg
            </div>
            <button onClick={async () => {
              if(window.confirm('Delete this entry?')) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`http://localhost:5000/api/patient/food/${entry._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setEntries(entries.filter(e => e._id !== entry._id));
                } catch (err) {
                  alert('Failed to delete entry.');
                }
              }
            }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodLogList;
