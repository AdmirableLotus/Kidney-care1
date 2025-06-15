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

        const totalsByDate = {};
        res.data.forEach((entry) => {
          const day = new Date(entry.date).toLocaleDateString("en-CA");
          totalsByDate[day] = (totalsByDate[day] || 0) + entry.amount;
        });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d;
        });

        const formattedData = last7Days.map((d) => {
          const key = d.toLocaleDateString("en-CA");
          return {
            date: d,
            amount: totalsByDate[key] || 0,
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching water intake data:", error);
      }
    };

    fetchWaterIntake();
  }, [reloadTrigger]);

  const mlToCups = (ml) => (ml / 240).toFixed(2);
  const mlToOunces = (ml) => (ml / 29.5735).toFixed(2);

  return (
    <div className="water-intake-chart">
      <h3 style={{ marginBottom: '1rem' }}>Water Intake (Last 7 Days)</h3>
      <table style={{ width: "100%", marginBottom: "1rem", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>mL</th>
            <th>Cups</th>
            <th>Ounces</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.date.toISOString()}>
              <td>{entry.date.toLocaleDateString()}</td>
              <td>{entry.amount}</td>
              <td>{mlToCups(entry.amount)}</td>
              <td>{mlToOunces(entry.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
            labelFormatter={(label) =>
              `Date: ${format(new Date(label), "PPP")}`
            }
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#23b500"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterIntakeChart;
