import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css'; // reuse shared styles

const StaffRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
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
        ...formData
      });

      setMessage(res.data.message || "Medical staff registered successfully!");
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Medical Staff Sign Up</h2>
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

        <label>Select Role</label>
        <select
          name="role"
          value={formData.role}
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

        <button type="submit">Register</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default StaffRegisterForm;
