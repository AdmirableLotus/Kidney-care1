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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine the final role
    const finalRole = formData.roleCategory === "patient"
      ? "patient"
      : formData.roleDetail || "medical_staff";

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
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" required />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />

        <label>Are you a:</label>
        <select name="roleCategory" value={formData.roleCategory} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="medical">Medical Staff</option>
        </select>

        {formData.roleCategory === "medical" && (
          <>
            <label>Specify your role:</label>
            <select name="roleDetail" value={formData.roleDetail} onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="dietitian">Dietitian</option>
              <option value="other">Other</option>
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
