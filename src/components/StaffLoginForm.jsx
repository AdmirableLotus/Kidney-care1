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
      // Only allow staff roles
      if (res.data.user && ["doctor", "nurse", "dietitian", "staff"].includes(res.data.user.role)) {
        localStorage.setItem("token", res.data.token);
        if (onLogin) onLogin(res.data.user);
      } else {
        setError("Access denied: Not a staff account.");
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="staff-login-form">
      <h3>Medical Staff Login</h3>
      <label>Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default StaffLoginForm;
