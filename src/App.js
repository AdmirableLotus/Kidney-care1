import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PatientDashboard from './components/PatientDashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/" element={<h1>Welcome to Kidney Care</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
