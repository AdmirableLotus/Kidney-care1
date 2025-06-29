import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PatientRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        ...formData,
        role: "patient"
      });

      setMessage(res.data.message || "Patient registered successfully!");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
    setLoading(false);
  };

  const quickRegister = async (payload, label) => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_BASE}/api/auth/register`, payload);
      setMessage(`${label} registered successfully!`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
    setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <button
          type="button"
          onClick={() =>
            quickRegister(
              {
                name: "Alena",
                email: "alena@example.com",
                password: "Alena2025!",
                role: "patient"
              },
              "Alena"
            )
          }
          disabled={loading}
          style={{ marginLeft: 8 }}
        >
          Register Alena
        </button>
        <button
          type="button"
          onClick={() =>
            quickRegister(
              {
                name: "Test Patient",
                email: `testpatient${Date.now()}@example.com`,
                password: "Test2025!",
                role: "patient"
              },
              "Test Patient"
            )
          }
          disabled={loading}
          style={{ marginLeft: 8 }}
        >
          Register Test Patient
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default PatientRegisterForm;
