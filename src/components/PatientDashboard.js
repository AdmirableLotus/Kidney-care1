import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PatientDashboard.css";

// Components
import WaterIntakeForm from "./WaterIntakeForm";
import WaterIntakeChart from "./WaterIntakeChart";
import FoodLogForm from "./FoodLogForm";
import FoodLogChart from "./FoodLogChart";
import FoodLogList from "./FoodLogList";
import MedicationForm from "./MedicationForm";
import MedicationList from "./MedicationList";

// Icons
import { FaTint, FaChartLine } from "react-icons/fa";

const PatientDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadChart, setReloadChart] = useState(false);

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
        <WaterIntakeForm onLogSuccess={() => setReloadChart(prev => !prev)} />
        <h3><FaChartLine /> Water Intake (Last 7 Days)</h3>
        <WaterIntakeChart reloadTrigger={reloadChart} />
      </div>

      {/* 🍽 Food Log Tracker */}
      <div className="widget food-log-section">
        <h3>Track Your Food Intake</h3>
        <FoodLogForm onEntryAdded={() => {}} />
        <h3>Your Food Intake (Last 7 Days)</h3>
        <FoodLogChart />
        <h3>Meal & Snack Log (Last 7 Days)</h3>
        <FoodLogList />
      </div>

      {/* 💊 Medication Tracker */}
      <div className="widget medication-section">
        <h3>Medication & Schedule</h3>
        <MedicationForm onAdded={() => {}} />
        <MedicationList />
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
