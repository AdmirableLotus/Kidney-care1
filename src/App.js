import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PatientDashboard from "./components/PatientDashboard";
import StaffDashboard from "./components/StaffDashboard";

// Get user from localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const App = () => {
  const user = getUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Dashboards */}
        <Route
          path="/dashboard/patient"
          element={
            user?.role === "patient" ? (
              <PatientDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/staff"
          element={
            user?.role && user.role !== "patient" ? (
              <StaffDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
