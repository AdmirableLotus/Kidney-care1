import React, { useState, useEffect } from "react";
import api from "../api";
import "./PatientDashboard.css";
import WaterIntakeTracker from "./WaterIntakeTracker";
import KidneySmartDashboard from "./KidneySmartDashboard";
import MedicationManager from "./MedicationManager";
import MedicationList from "./MedicationList";
import BloodPressureTracker from "./BloodPressureTracker";
import FluidDashboard from "./FluidDashboard";
import { FaTint, FaHeartbeat, FaPills, FaBook } from "react-icons/fa";

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      api.get("/auth/me")
        .then(res => {
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
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
      <div className="dashboard-loading-screen">
        <div className="text-2xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (user && user.role !== "patient") {
    return (
      <div className="dashboard-loading-screen">
        <div className="text-2xl text-red-400">Access denied. This dashboard is for patients only.</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-loading-screen">
        <div className="text-2xl text-yellow-400">No user found. Please log in again.</div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back{user && user.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-lg text-blue-200">Your Kidney Care Dashboard</p>
      </div>

      <div className="dashboard-main">
        <div className="tracker-row">
          <div className="dashboard-card">
            <div className="dashboard-section-header">
              <FaTint className="icon text-cyan-300" />
              <h3>Water Intake</h3>
            </div>
            <WaterIntakeTracker />
          </div>

          <div className="dashboard-card">
            <div className="dashboard-section-header">
              <FaHeartbeat className="icon text-red-300" />
              <h3>Blood Pressure</h3>
            </div>
            <BloodPressureTracker />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-section-header">
            <FaBook className="icon text-green-300" />
            <h3>Food & Nutrition</h3>
          </div>
          <KidneySmartDashboard />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-section-header">
            <FaPills className="icon text-purple-300" />
            <h3>Medications</h3>
          </div>
          {user.role === "patient" && <MedicationList patientId={user._id} />}
          {user.role === "nurse" && <MedicationManager patientId={user._id} />}
        </div>

        {user && (
          <div className="dashboard-card wide">
            <FluidDashboard patientId={user._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
