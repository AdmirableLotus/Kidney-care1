import React, { useState } from "react";
import axios from "axios";

const WaterIntakeForm = ({ onSubmitSuccess }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Failed to submit water intake:", error);
    }
  };

  return (
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
  );
};

export default WaterIntakeForm;
