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
import { format, parseISO } from "date-fns";

const WaterIntakeChart = ({ reloadTrigger }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWaterIntake = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/water-intake", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dailyTotals = {};

        res.data.forEach(entry => {
          const day = new Date(entry.date).toISOString().split("T")[0];
          if (!dailyTotals[day]) dailyTotals[day] = 0;
          dailyTotals[day] += entry.amount;
        });

        const formatted = Object.entries(dailyTotals)
          .map(([date, amount]) => ({ date, amount }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setData(formatted);
      } catch (error) {
        console.error("Error fetching water intake data:", error);
      }
    };

    fetchWaterIntake();
  }, [reloadTrigger]);

  return (
    <div className="water-intake-chart">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => format(new Date(str), "MMM d")}
          />
          <YAxis unit="ml" />
          <Tooltip
            formatter={(value) => `${value} ml`}
            labelFormatter={(label) => format(new Date(label), "PPP")}
          />
          <Line type="monotone" dataKey="amount" stroke="#23b500" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterIntakeChart;
