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

      {/* Circular Summary Stats */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 -mt-32 mb-12 z-10 relative">
        {/* Water Intake */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="#e0f7fa" />
              <circle cx="55" cy="55" r="48" fill="none" stroke="#38bdf8" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset="{301.59 - (summary.totalWater ? Math.min(summary.totalWater / 2000, 1) * 301.59 : 0)}" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-cyan-700">{summary.totalWater !== undefined ? summary.totalWater : '--'}<span className="text-xs font-medium">ml</span></span>
          </div>
          <div className="mt-2 text-sm text-cyan-700 font-semibold">Water Intake</div>
        </div>
        {/* Blood Pressure */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="#fce4ec" />
              <circle cx="55" cy="55" r="48" fill="none" stroke="#f472b6" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset="{301.59 - (summary.avgBP ? Math.min(summary.avgBP / 180, 1) * 301.59 : 0)}" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-pink-700">{summary.avgBP !== undefined ? summary.avgBP : '--'}</span>
          </div>
          <div className="mt-2 text-sm text-pink-700 font-semibold">Avg Blood Pressure</div>
        </div>
        {/* Medications */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="#e8f5e9" />
              <circle cx="55" cy="55" r="48" fill="none" stroke="#34d399" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset="{301.59 - (summary.medCount ? Math.min(summary.medCount / 10, 1) * 301.59 : 0)}" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-green-700">{summary.medCount !== undefined ? summary.medCount : '--'}</span>
          </div>
          <div className="mt-2 text-sm text-green-700 font-semibold">Medications</div>
        </div>
        {/* Meals Logged */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="#fffde7" />
              <circle cx="55" cy="55" r="48" fill="none" stroke="#fbbf24" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset="{301.59 - (summary.foodCount ? Math.min(summary.foodCount / 10, 1) * 301.59 : 0)}" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-yellow-700">{summary.foodCount !== undefined ? summary.foodCount : '--'}</span>
          </div>
          <div className="mt-2 text-sm text-yellow-700 font-semibold">Meals Logged</div>
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
