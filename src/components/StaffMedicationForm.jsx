import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffMedicationForm = ({ onAdded }) => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    user: "",
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch all patients for dropdown
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users?role=patient", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch {
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/patient/medication",
        { ...form, time: form.time.split(",").map(t => t.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Medication assigned!");
      setForm({
        user: "",
        name: "",
        dosage: "",
        frequency: "",
        time: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        notes: "",
      });
      if (onAdded) onAdded();
    } catch (err) {
      setError("Failed to assign medication.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="staff-medication-form" style={{
      background: 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)',
      borderRadius: '18px',
      boxShadow: '0 4px 32px rgba(80,80,180,0.15)',
      padding: '2rem',
      color: '#fff',
      maxWidth: 480,
      margin: '2rem auto',
      fontFamily: 'Poppins, Arial, sans-serif',
    }}>
      <h3 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 24 }}>Assign Medication to Patient</h3>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Patient:</span>
        <select name="user" value={form.user} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }}>
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.name || p.email}</option>
          ))}
        </select>
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Name:</span>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Dosage:</span>
        <input name="dosage" value={form.dosage} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Frequency:</span>
        <input name="frequency" value={form.frequency} onChange={handleChange} required placeholder="e.g. Once daily" style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Time(s):</span>
        <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 08:00, 20:00" style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Start Date:</span>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>End Date:</span>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Notes:</span>
        <input name="notes" value={form.notes} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', marginTop: 4 }} />
      </label>
      <button type="submit" disabled={loading} style={{
        width: '100%',
        padding: '12px 0',
        borderRadius: 10,
        border: 'none',
        background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize: '1.1rem',
        marginTop: 12,
        boxShadow: '0 2px 8px rgba(80,80,180,0.10)'
      }}>{loading ? "Assigning..." : "Assign Medication"}</button>
      {error && <div className="error" style={{ color: '#ffbaba', marginTop: 12 }}>{error}</div>}
      {success && <div className="success" style={{ color: '#baffc9', marginTop: 12 }}>{success}</div>}
    </form>
  );
};

export default StaffMedicationForm;
