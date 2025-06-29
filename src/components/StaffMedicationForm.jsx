import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffMedicationForm = ({ onAdded }) => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    user: "",
    name: "",
    dosage: "",
    frequency: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users?role=patient", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/patients/${form.user}/medications`, {
        name: form.name,
        dosage: form.dosage,
        frequency: form.frequency,
        notes: form.notes
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Medication assigned successfully.");
      setForm({
        user: "",
        name: "",
        dosage: "",
        frequency: "",
        notes: "",
      });
      if (onAdded) onAdded();
    } catch (err) {
      console.error("Failed to assign medication:", err);
      setError("Failed to assign medication.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="staff-medication-form"
      style={{
        background: "linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)",
        borderRadius: 18,
        padding: "2rem",
        maxWidth: 480,
        margin: "2rem auto",
        color: "#fff",
        fontFamily: "Poppins, Arial, sans-serif",
        boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
      }}
    >
      <h3 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24 }}>
        Assign Medication to Patient
      </h3>

      {[
        {
          label: "Patient",
          name: "user",
          type: "select",
          options: patients,
        },
        {
          label: "Name",
          name: "name",
          type: "text",
        },
        {
          label: "Dosage",
          name: "dosage",
          type: "text",
        },
        {
          label: "Frequency",
          name: "frequency",
          type: "text",
          placeholder: "e.g. Once daily",
        },
        {
          label: "Notes",
          name: "notes",
          type: "text",
        },
      ].map((field, idx) => (
        <label key={idx} style={{ display: "block", marginBottom: 16 }}>
          <span style={{ fontWeight: 500 }}>{field.label}:</span>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "none",
                marginTop: 4,
              }}
            >
              <option value="">Select patient</option>
              {field.options.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name || p.email}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || ""}
              required={field.name !== "notes"}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "none",
                marginTop: 4,
              }}
            />
          )}
        </label>
      ))}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.1rem",
          marginTop: 12,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 1,
          transition: "background 0.3s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)")
        }
      >
        {loading ? "Assigning..." : "Assign Medication"}
      </button>

      {error && (
        <div className="error" style={{ color: "#ffbaba", marginTop: 12 }}>
          {error}
        </div>
      )}
      {success && (
        <div className="success" style={{ color: "#baffc9", marginTop: 12 }}>
          {success}
        </div>
      )}
    </form>
  );
};

export default StaffMedicationForm;
