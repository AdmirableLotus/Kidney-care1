import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const FoodLogChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/food", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dailyTotals = {};
        res.data.forEach((entry) => {
          const day = new Date(entry.date).toLocaleDateString("en-CA");
          if (!dailyTotals[day]) {
            dailyTotals[day] = { protein: 0, phosphorus: 0, sodium: 0, potassium: 0 };
          }
          dailyTotals[day].protein += entry.protein;
          dailyTotals[day].phosphorus += entry.phosphorus;
          dailyTotals[day].sodium += entry.sodium;
          dailyTotals[day].potassium += entry.potassium;
        });

        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const local = d.toLocaleDateString("en-CA");
          days.push(local);
        }

        const formatted = days.map((date) => ({
          date: new Date(date),
          protein: dailyTotals[date]?.protein || 0,
          phosphorus: dailyTotals[date]?.phosphorus || 0,
          sodium: dailyTotals[date]?.sodium || 0,
          potassium: dailyTotals[date]?.potassium || 0,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching food chart data:", err);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="food-log-chart">
      <h3>Nutrient Intake (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => format(date, "MMM d")} />
          <YAxis />
          <Tooltip labelFormatter={(label) => format(new Date(label), "PPP")} />
          <Legend />
          <Line type="monotone" dataKey="protein" stroke="#007bff" name="Protein (g)" />
          <Line type="monotone" dataKey="phosphorus" stroke="#ff9800" name="Phosphorus (mg)" />
          <Line type="monotone" dataKey="sodium" stroke="#00b894" name="Sodium (mg)" />
          <Line type="monotone" dataKey="potassium" stroke="#d500f9" name="Potassium (mg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FoodLogChart;