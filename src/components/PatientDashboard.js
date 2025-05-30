import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PatientDashboard.css";

// Components
import WaterIntakeForm from "./WaterIntakeForm";
import WaterIntakeChart from "./WaterIntakeChart";
import FoodLogForm from "./FoodLogForm";
import FoodLogChart from "./FoodLogChart";
import FoodLogList from "./FoodLogList";
import MedicationList from "./MedicationList";
import BloodPressureForm from "./BloodPressureForm";
import BloodPressureChart from "./BloodPressureChart";
import FluidDashboard from './FluidDashboard';

// Icons
import { FaTint, FaChartLine, FaHeartbeat, FaPills, FaBook, FaAppleAlt } from "react-icons/fa";

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

  // Fetch summary stats for dashboard cards
  const fetchSummary = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/patient/summary/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data);
    } catch (err) {
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
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          setUser(res.data);
          fetchSummary(res.data._id);
        }).catch(() => {});
      }
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
      {/* Header Section */}
      <div className="relative w-full h-48 md:h-56 flex items-center justify-between px-8 py-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 rounded-b-3xl shadow-lg mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back{user && user.name ? `, ${user.name}` : ''} <span role="img" aria-label="smiling face">😊</span></h2>
          <p className="text-lg opacity-80">Your Kidney Care Dashboard</p>
        </div>
        <div className="hidden md:block absolute right-8 top-6">
          {/* Decorative chart background or SVG can go here for visual flair */}
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 z-10 relative">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-700 rounded-3xl shadow-2xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-blue-400/40">
          <FaTint className="text-4xl mb-2 text-cyan-400 drop-shadow" />
          <div className="text-3xl font-extrabold tracking-tight">{summary.totalWater !== undefined ? summary.totalWater : '--'}<span className="text-base ml-1 font-medium">ml</span></div>
          <div className="text-xs opacity-80 mt-1">Water Intake (Today)</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900 to-pink-700 rounded-3xl shadow-2xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-pink-400/40">
          <FaHeartbeat className="text-4xl mb-2 text-pink-300 drop-shadow" />
          <div className="text-3xl font-extrabold tracking-tight">{summary.avgBP !== undefined ? summary.avgBP : '--'}</div>
          <div className="text-xs opacity-80 mt-1">Avg Blood Pressure</div>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-teal-700 rounded-3xl shadow-2xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-green-400/40">
          <FaPills className="text-4xl mb-2 text-green-300 drop-shadow" />
          <div className="text-3xl font-extrabold tracking-tight">{summary.medCount !== undefined ? summary.medCount : '--'}</div>
          <div className="text-xs opacity-80 mt-1">Medications</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-orange-500 rounded-3xl shadow-2xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-yellow-300/40">
          <FaAppleAlt className="text-4xl mb-2 text-yellow-300 drop-shadow" />
          <div className="text-3xl font-extrabold tracking-tight">{summary.foodCount !== undefined ? summary.foodCount : '--'}</div>
          <div className="text-xs opacity-80 mt-1">Meals Logged</div>
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
        {/* Food Log Card */}
        <div className="bg-gradient-to-br from-green-900 to-teal-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 flex items-center"><FaAppleAlt className="mr-2 text-yellow-300" />Track Your Food Intake</h3>
          <FoodLogForm onEntryAdded={() => {}} />
          <h3 className="text-md font-semibold mt-4 mb-2">Your Food Intake (Last 7 Days)</h3>
          <FoodLogChart />
          <h3 className="text-md font-semibold mt-4 mb-2">Meal & Snack Log (Last 7 Days)</h3>
          <FoodLogList />
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
        {/* Journal Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 flex flex-col md:col-span-2">
          <h3 className="text-lg font-semibold mb-2 flex items-center"><FaBook className="mr-2 text-blue-200" />Daily Journal</h3>
          <form onSubmit={handleSubmit} className="journal-form flex flex-col">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Write something about today..."
              rows={4}
              required
              className="rounded-lg p-3 text-black mb-2"
            />
            <button type="submit" className="self-end bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold">Submit</button>
          </form>
          {error && <p className="text-red-400 mt-2">{error}</p>}
          <h3 className="text-md font-semibold mt-6 mb-2">Your Past Entries</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="entry-list space-y-2 mt-2">
              {entries.map((entry, index) => (
                <li key={index} className="bg-gray-700 rounded-lg p-2">{entry.content}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
