import React, { useState } from "react";
import { register } from "../api";  // reuse your api helper
import "./RegisterForm.css";        // reuse existing form styles

const StaffRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    try {
      const res = await register(formData);
      setSuccess(res.data.message || "Registration successful!");
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Medical Staff Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

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
          placeholder="Password"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="medical_staff">Medical Staff (General)</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="dietitian">Dietitian</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StaffRegisterForm;
