import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTint, FaChartLine } from "react-icons/fa";

const WaterIntakeForm = () => {
  const [amount, setAmount] = useState("");
  const [intakeData, setIntakeData] = useState([]);
  const [error, setError] = useState("");

  const fetchWaterData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/patient/water-intake",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIntakeData(response.data);
    } catch (err) {
      console.error("Failed to fetch water intake data:", err);
      setError("Error loading water intake data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/patient/water-intake",
        { amount: parseInt(amount, 10) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAmount("");
      fetchWaterData(); // Refresh chart/data after logging water
    } catch (err) {
      console.error("Failed to log water intake:", err);
      setError("Error logging water intake.");
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, []);

  return (
    <div className="water-intake-container">
      <h3>
        <FaTint /> Track Your Water Intake
      </h3>

      <form onSubmit={handleSubmit} className="water-intake-form">
        <label>
          Amount (ml):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log Water</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h3>
        <FaChartLine /> Water Intake (Last 7 Days)
      </h3>
      <div className="water-intake-chart">
        {intakeData.length === 0 ? (
          <p>No data available.</p>
        ) : (
          <ul>
            {intakeData.map((entry) => (
              <li key={entry._id}>
                {new Date(entry.date).toLocaleDateString()}: {entry.amount} ml
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WaterIntakeForm;
