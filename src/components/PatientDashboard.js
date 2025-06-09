import React, { useState, useEffect } from "react";
import api from "../api";
import "./PatientDashboard.css";

// Components
import WaterIntakeForm from "./WaterIntakeForm";
import WaterIntakeChart from "./WaterIntakeChart";
import KidneySmartDashboard from "./KidneySmartDashboard";
import MedicationList from "./MedicationList";
import BloodPressureForm from "./BloodPressureForm";
import BloodPressureChart from "./BloodPressureChart";
import FluidDashboard from './FluidDashboard';
import FoodLogForm from './FoodLogForm';

// Icons
import { FaTint, FaChartLine, FaHeartbeat, FaPills, FaBook } from "react-icons/fa";

const PatientDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadChart, setReloadChart] = useState(false);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({});

  const fetchEntries = async () => {
    try {
      const res = await api.get("/patient/entries");
      setEntries(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch entries", err);
      setError("Unable to load entries. Please try refreshing the page.");
      setLoading(false);
    }
  };
  // Fetch summary stats for dashboard cards
  const fetchSummary = async (userId) => {
    try {
      const res = await api.get(`/patient/summary/${userId}`);
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
      setSummary({});
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchSummary(u._id);
    } else {
      api.get('/auth/me')
        .then(res => {
          const userData = res.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          fetchSummary(userData._id);
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          // Redirect to login if authentication fails
          if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
          }
        });
    }
  }, []);

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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-2xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Water Intake Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <FaTint className="text-blue-300 text-2xl" />
              <h3>Water Intake</h3>
            </div>
            <WaterIntakeForm onEntryAdded={() => setReloadChart(prev => !prev)} />
            <WaterIntakeChart reload={reloadChart} />
          </div>

          {/* Food Log Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <FaBook className="text-green-300 text-2xl" />
              <h3>Food & Nutrition</h3>
            </div>
            <KidneySmartDashboard />
          </div>

          {/* Medication Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <FaPills className="text-purple-300 text-2xl" />
              <h3>Medications</h3>
            </div>
            <MedicationList />
          </div>

          {/* Blood Pressure Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <FaHeartbeat className="text-red-300 text-2xl" />
              <h3>Blood Pressure</h3>
            </div>
            <BloodPressureForm onEntryAdded={() => setReloadChart(prev => !prev)} />
            <BloodPressureChart reload={reloadChart} />
          </div>

          {/* Fluid Intake Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <FaChartLine className="text-teal-300 text-2xl" />
              <h3>Fluid Intake</h3>
            </div>
            <FluidDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;