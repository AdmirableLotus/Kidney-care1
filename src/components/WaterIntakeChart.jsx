import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const WaterIntakeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWaterIntake = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/water-intake", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Format data for Recharts
        const formatted = res.data.map(entry => ({
          date: new Date(entry.date).toLocaleDateString(),
          amount: entry.amount
        }));

        setData(formatted);
      } catch (error) {
        console.error("Error fetching water intake data:", error);
      }
    };

    fetchWaterIntake();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>📊 Water Intake (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: "ml", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#007BFF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterIntakeChart;
