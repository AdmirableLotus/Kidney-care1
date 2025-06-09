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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Modern Analytics Header */}
      <div className="relative flex flex-col items-center justify-center w-full mb-12">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-0">
          <div className="rounded-full bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 opacity-80 w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center shadow-2xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center pt-12">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-400 via-purple-300 to-blue-300 flex items-center justify-center shadow-xl border-8 border-white/60">
            <span className="text-7xl md:text-8xl text-indigo-700 opacity-80">🧑‍⚕️</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-2 text-indigo-900">Welcome back{user && user.name ? `, ${user.name}` : ''}</h2>
          <p className="text-lg text-indigo-700 opacity-80">Your Kidney Care Dashboard</p>
        </div>
      </div>

      {/* Main Grid Widgets */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pb-10">
        {/* Water Intake Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 flex items-center"><FaTint className="mr-2 text-cyan-300" />Track Your Water Intake</h3>
          <WaterIntakeForm onLogSuccess={() => setReloadChart(prev => !prev)} />
          <h3 className="text-md font-semibold mt-4 mb-2 flex items-center"><FaChartLine className="mr-2 text-cyan-200" />Water Intake (Last 7 Days)</h3>
          <WaterIntakeChart reloadTrigger={reloadChart} />
        </div>

        {/* Food & Nutrition Section - Now using KidneySmartDashboard */}
        <div className="bg-gradient-to-br from-green-900 to-teal-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <KidneySmartDashboard />
        </div>

        {/* Medication Card */}
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 flex items-center"><FaPills className="mr-2 text-green-300" />Medication & Schedule</h3>
          <MedicationList />
        </div>

        {/* Blood Pressure Card */}
        <div className="bg-gradient-to-br from-pink-900 to-red-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 flex items-center"><FaHeartbeat className="mr-2 text-pink-300" />Blood Pressure</h3>
          <BloodPressureForm onEntryAdded={() => {}} />
          <BloodPressureChart />
        </div>

        {/* Fluid Intake Dashboard Card */}
        {user && (
          <div className="bg-gradient-to-br from-cyan-900 to-blue-800 rounded-2xl shadow-lg p-6 flex flex-col md:col-span-2">
            <FluidDashboard patientId={user._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;