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
import { format } from "date-fns";

const WaterIntakeChart = ({ reloadTrigger }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWaterIntake = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/water", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dailyTotals = {};
        res.data.forEach((entry) => {
          const day = new Date(entry.date).toLocaleDateString("en-CA");
          dailyTotals[day] = (dailyTotals[day] || 0) + entry.amount;
        });

        // Generate last 7 days (local dates)
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const local = d.toLocaleDateString("en-CA");
          days.push(local);
        }

        // Merge with fetched data
        const formatted = days.map((date) => ({
          date: new Date(date),
          amount: dailyTotals[date] || 0,
        }));

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
            tickFormatter={(date) => format(date, "MMM d")}
          />
          <YAxis unit="ml" />
          <Tooltip
            formatter={(value) => `${value} ml`}
            labelFormatter={(label) => format(new Date(label), "PPP")}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#23b500"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterIntakeChart;
