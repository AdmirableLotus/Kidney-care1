import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleCategory: "patient",
    roleDetail: "",
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

    const isMedical = formData.roleCategory === "medical";
    if (isMedical && !formData.roleDetail) {
      setMessage("Please specify your role as medical staff.");
      setLoading(false);
      return;
    }

    const finalRole = isMedical ? formData.roleDetail : "patient";

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: finalRole
      });

      setMessage(res.data.message || "Registered successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="name"
          onChange={handleChange}
          value={formData.name}
          placeholder="Name"
          required
        />
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          required
        />

        <label>Are you a:</label>
        <select
          name="roleCategory"
          value={formData.roleCategory}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="medical">Medical Staff</option>
        </select>

        {formData.roleCategory === "medical" && (
          <>
            <label>Specify your role:</label>
            <select
              name="roleDetail"
              value={formData.roleDetail}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="dietitian">Dietitian</option>
              <option value="other">Other</option>
            </select>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default RegisterForm;
