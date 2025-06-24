import React, { useState, useEffect } from "react";
import api from "../api";
import "./PatientDashboard.css";
// import axios from "axios";

// Components
import WaterIntakeTracker from "./WaterIntakeTracker";
import KidneySmartDashboard from "./KidneySmartDashboard";
import MedicationList from "./MedicationList";
import BloodPressureTracker from "./BloodPressureTracker";
import FluidDashboard from "./FluidDashboard";

// Icons
import { FaTint, FaHeartbeat, FaPills, FaBook } from "react-icons/fa";

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
    } else {
      api.get("/auth/me")
        .then(res => {
          const userData = res.data;
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        })
        .catch(err => {
          console.error("Failed to fetch user:", err);
          if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
          }
        });
    }
    setLoading(false);
  }, []);

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

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
  //       <div className="text-2xl text-red-400">DEBUG: {error}</div>
  //     </div>
  //   );
  // }

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

      <div className="max-w-6xl mx-auto p-4 pb-10">
        <div className="tracker-row">
          <div className="water-intake-section">
            <div className="flex items-center gap-2 mb-4">
              <FaTint className="text-2xl text-cyan-300" />
              <h3 className="text-xl font-semibold">Water Intake</h3>
            </div>
            <WaterIntakeTracker />
          </div>
          <div className="blood-pressure-section">
            <div className="flex items-center gap-2 mb-4">
              <FaHeartbeat className="text-2xl text-red-300" />
              <h3 className="text-xl font-semibold">Blood Pressure</h3>
            </div>
            <BloodPressureTracker />
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
