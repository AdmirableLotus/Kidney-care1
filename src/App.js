import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PatientDashboard from './components/PatientDashboard';
import StaffDashboard from './components/StaffDashboard';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar'; // if you created a styled Navbar component
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
