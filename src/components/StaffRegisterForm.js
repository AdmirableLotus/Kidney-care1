import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css';

const StaffRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
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
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(res.data.message || "✅ Registration successful!");
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.message || "❌ Registration failed.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Medical Staff Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label style={{ marginTop: '0.5rem' }}>Select Medical Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">-- Choose Role --</option>
          <option value="medical_staff">Medical Staff (General)</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="dietitian">Dietitian</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default StaffRegisterForm;
