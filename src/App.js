// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import StaffLoginForm from './components/StaffLoginForm';
import StaffRegisterForm from './components/StaffRegisterForm';
import PatientDashboard from './components/PatientDashboard';
import StaffDashboard from './components/StaffDashboard';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="page-background" />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Staff-specific auth */}
          <Route path="/staff/login" element={<StaffLoginForm />} />
          <Route path="/staff/register" element={<StaffRegisterForm />} />

          {/* Protected dashboards */}
          <Route
            path="/dashboard/patient"
            element={
              <PrivateRoute>
                <PatientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/staff"
            element={
              <PrivateRoute>
                <StaffDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
