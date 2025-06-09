import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PatientDashboard from './components/PatientDashboard';
import StaffDashboard from './components/StaffDashboard';
import HomePage from './components/HomePage';
import React from 'react';


function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="page-background" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/dashboard/staff" element={<StaffDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
