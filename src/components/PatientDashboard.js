import React, { useState, useEffect } from "react";
import api from "../api";
import "./PatientDashboard.css";
import axios from "axios";

// Components
import WaterIntakeForm from "./WaterIntakeForm";
import WaterIntakeChart from "./WaterIntakeChart";
import KidneySmartDashboard from "./KidneySmartDashboard";
import MedicationList from "./MedicationList";
import BloodPressureForm from "./BloodPressureForm";
import BloodPressureChart from "./BloodPressureChart";
import FluidDashboard from "./FluidDashboard";
import FoodLogForm from "./FoodLogForm";

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
    } catch (err) {
      console.error("Failed to fetch entries", err);
      setError("Unable to load entries. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (userId) => {
    try {
      const res = await api.get(`/patient/summary/${userId}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setSummary({});
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchSummary(u._id);
    } else {
      api.get("/auth/me")
        .then(res => {
          const userData = res.data;
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
          fetchSummary(userData._id);
        })
        .catch(err => {
          console.error("Failed to fetch user:", err);
          if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
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
          headers: { Authorization: `Bearer ${token}` },
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
        <div className="text-2xl" style={{color:'red'}}>DEBUG: Loading your dashboard...</div>
      </div>
    );
  }

  if (user && user.role !== "patient") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-2xl text-red-400">Access denied. This dashboard is for patients only.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-2xl text-red-400">DEBUG: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-2xl" style={{color:'orange'}}>DEBUG: No user found. Please log in again.</div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard-bg min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      <h1 style={{color: 'red', zIndex: 9999}}>DEBUG: Patient Dashboard Loaded</h1>
      <div className="pt-8 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back{user && user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-lg text-blue-200">Your Kidney Care Dashboard</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pb-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaTint className="text-2xl text-cyan-300" />
            <h3 className="text-xl font-semibold">Water Intake</h3>
          </div>
          <WaterIntakeForm onLogSuccess={() => setReloadChart(prev => !prev)} />
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Last 7 Days</h4>
            <WaterIntakeChart reloadTrigger={reloadChart} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaBook className="text-2xl text-green-300" />
            <h3 className="text-xl font-semibold">Food & Nutrition</h3>
          </div>
          <KidneySmartDashboard />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaPills className="text-2xl text-purple-300" />
            <h3 className="text-xl font-semibold">Medications</h3>
          </div>
          <MedicationList />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaHeartbeat className="text-2xl text-red-300" />
            <h3 className="text-xl font-semibold">Blood Pressure</h3>
          </div>
          <BloodPressureForm onEntryAdded={() => setReloadChart(prev => !prev)} />
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">History</h4>
            <BloodPressureChart />
          </div>
        </div>

        {user && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 md:col-span-2">
            <FluidDashboard patientId={user._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
