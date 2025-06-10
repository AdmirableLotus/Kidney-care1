import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

const FoodLogChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/food", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const totalsByDate = {};

        res.data.forEach((entry) => {
          const day = format(new Date(entry.date), "yyyy-MM-dd");
          if (!totalsByDate[day]) {
            totalsByDate[day] = {
              date: day,
              protein: 0,
              phosphorus: 0,
              sodium: 0,
              potassium: 0,
            };
          }
          totalsByDate[day].protein += entry.protein || 0;
          totalsByDate[day].phosphorus += entry.phosphorus || 0;
          totalsByDate[day].sodium += entry.sodium || 0;
          totalsByDate[day].potassium += entry.potassium || 0;
        });

        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
          return totalsByDate[date] || {
            date,
            protein: 0,
            phosphorus: 0,
            sodium: 0,
            potassium: 0,
          };
        });

        setData(last7Days);
        setError("");
      } catch (err) {
        console.error("Failed to load food log chart:", err);
        setError("Unable to load chart. Please try again later.");
        setData([]);
      }
    };

    fetchFoodData();
  }, []);

  return (
    <div className="food-log-chart">
      <h3 className="text-lg font-semibold mb-2">Nutrient Intake (Last 7 Days)</h3>

      {error && (
        <div className="text-red-500 mb-4 font-medium">{error}</div>
      )}

      {data.length === 0 && !error ? (
        <div className="text-gray-300 italic">No data to display.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => format(new Date(dateStr), "MMM d")}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => `${value}`}
              labelFormatter={(label) =>
                format(new Date(label), "MMMM d, yyyy")
              }
            />
            <Legend />
            <Line type="monotone" dataKey="protein" stroke="#007bff" name="Protein (g)" />
            <Line type="monotone" dataKey="phosphorus" stroke="#ff9800" name="Phosphorus (mg)" />
            <Line type="monotone" dataKey="sodium" stroke="#00b894" name="Sodium (mg)" />
            <Line type="monotone" dataKey="potassium" stroke="#d500f9" name="Potassium (mg)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FoodLogChart;
