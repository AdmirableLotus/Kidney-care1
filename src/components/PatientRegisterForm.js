import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css'; // reuse styling

const PatientRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        role: "patient"
      });

      setMessage(res.data.message || "Patient registered successfully!");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  const handleAlena = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: "Alena",
        email: "alena@example.com",
        password: "Alena2025!",
        role: "patient"
      });
      setMessage("Patient Alena registered successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  const handleTestPatient = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: "Test Patient",
        email: `testpatient${Date.now()}@example.com`,
        password: "Test2025!",
        role: "patient"
      });
      setMessage("Test patient registered successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Patient Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create Password"
          required
        />
        <button type="submit">Register</button>
        <button type="button" onClick={handleAlena} style={{marginLeft:8}}>Register Alena</button>
        <button type="button" onClick={handleTestPatient} style={{marginLeft:8}}>Register Test Patient</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default PatientRegisterForm;
