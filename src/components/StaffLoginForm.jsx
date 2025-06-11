import React, { useState } from "react";
import axios from "axios";

const StaffLoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const user = res.data.user;

      // Allow only specific staff roles
      const allowedRoles = ["doctor", "nurse", "dietitian", "medical_staff", "staff"];
      if (user && allowedRoles.includes(user.role)) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        if (onLogin) onLogin(user);
      } else {
        setError("Access denied: Not a staff account.");
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="staff-login-form" style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginBottom: 16 }}>Medical Staff Login</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: 10, backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold", border: "none", borderRadius: 6 }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && (
        <div className="error" style={{ color: "#d32f2f", marginTop: 16 }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default StaffLoginForm;
