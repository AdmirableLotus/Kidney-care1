import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import PatientRegisterForm from './components/PatientRegisterForm';
import StaffRegisterForm from './components/StaffRegisterForm';
import PatientDashboard from './components/PatientDashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register/patient" element={<PatientRegisterForm />} />
        <Route path="/register/staff" element={<StaffRegisterForm />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
