import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PatientDashboard.css";

// Components
import WaterIntakeForm from "./WaterIntakeForm";
import WaterIntakeChart from "./WaterIntakeChart";

// Icons
import { FaTint, FaChartLine } from "react-icons/fa";

const PatientDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/patient/entries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch entries", err);
      setError("Unable to load entries.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/patient/entries",
        { content: newEntry },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewEntry("");
      fetchEntries();
    } catch (err) {
      console.error("Failed to submit entry", err);
      setError("Could not submit your entry.");
    }
  };

  return (
    <div className="patient-dashboard">
      <h2>
        Welcome back <span role="img" aria-label="smiling face">😊</span>
      </h2>

      {/* 💧 Water Intake Tracker */}
      <div className="widget water-intake-section">
        <h3><FaTint /> Track Your Water Intake</h3>
        <WaterIntakeForm />
        <h3><FaChartLine /> Water Intake (Last 7 Days)</h3>
        <WaterIntakeChart />
      </div>

      {/* 📝 Daily Journal */}
      <form onSubmit={handleSubmit} className="journal-form">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write something about today..."
          rows={4}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h3>Your Past Entries</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry, index) => (
            <li key={index}>{entry.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientDashboard;
