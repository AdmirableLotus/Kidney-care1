import React, { useState, useEffect } from "react";
import API from "../utils/auth"; // Axios instance with auth header

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState({ water: "", phosphorus: "" });
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/healthdata/add", {
        userId: user.id,
        water: data.water,
        phosphorus: data.phosphorus,
      });

      setMessage(res.data.message || "Data logged successfully");
      setData({ water: "", phosphorus: "" });
      fetchEntries();
    } catch (err) {
      setMessage("Failed to log data");
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await API.get(`/healthdata/user/${user.id}`);
      setEntries(res.data || []);
    } catch {
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name}</h2>

      <form onSubmit={handleSubmit} className="health-form">
        <h3>Log Health Data</h3>
        <input
          name="water"
          value={data.water}
          onChange={handleChange}
          placeholder="Water intake (ml)"
          type="number"
          required
        />
        <input
          name="phosphorus"
          value={data.phosphorus}
          onChange={handleChange}
          placeholder="Phosphorus (mg)"
          type="number"
          required
        />
        <button type="submit">Save</button>
      </form>

      {message && <p>{message}</p>}

      <div className="log-entries">
        <h3>Recent Logs</h3>
        {entries.length === 0 ? (
          <p>No data yet.</p>
        ) : (
          <ul>
            {entries.map((entry, idx) => (
              <li key={idx}>
                💧 Water: {entry.water} ml, 🧪 Phosphorus: {entry.phosphorus} mg
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
