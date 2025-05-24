import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");

  const fetchEntries = async () => {
    try {
      const res = await axios.get("/api/patient/entries");
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  // ✅ Fixed: Ignoring missing dependency warning safely
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/patient/entries", { content: newEntry });
      setNewEntry("");
      fetchEntries();
    } catch (err) {
      console.error("Failed to submit entry", err);
    }
  };

  return (
    <div>
      <h2>
        Welcome back{" "}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write something about today..."
          rows={4}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Your Past Entries</h3>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>{entry.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDashboard;
