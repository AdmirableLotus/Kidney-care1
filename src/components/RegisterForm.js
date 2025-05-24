import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "patient", // 'patient' or 'medical'
    medicalRole: "",
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

    const role =
      formData.userType === "medical"
        ? formData.medicalRole
        : "patient";

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });

      setMessage(res.data.message || "Registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        userType: "patient",
        medicalRole: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
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
          placeholder="Email Address"
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

        <label>User Type</label>
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="medical">Medical Staff</option>
        </select>

        {formData.userType === "medical" && (
          <>
            <label>Medical Role</label>
            <select
              name="medicalRole"
              value={formData.medicalRole}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="dietitian">Dietitian</option>
              <option value="social_worker">Social Worker</option>
              <option value="nephrologist">Nephrologist</option>
              <option value="primary_care_doctor">Primary Care Doctor</option>
              <option value="transplant_team_member">Transplant Team Member</option>
            </select>
          </>
        )}

        <button type="submit">Register</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default RegisterForm;
