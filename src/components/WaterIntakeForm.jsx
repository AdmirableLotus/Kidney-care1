import React, { useState } from "react";
import axios from "axios";

const WaterIntakeForm = ({ onSubmitSuccess }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting water intake:", amount);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/patient/water-intake",
        { amount: parseInt(amount, 10) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Water intake logged successfully:", response.data);
      setAmount("");
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting water intake:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="water-intake-form">
      <label htmlFor="amount">Amount (ml):</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min="0"
        placeholder="e.g. 500"
      />
      <button type="submit">Log Water</button>
    </form>
  );
};

export default WaterIntakeForm;
