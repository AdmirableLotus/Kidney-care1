import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StaffDashboardV2 = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [fluidData, setFluidData] = useState([]);
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    // Fetch all patients
    const fetchPatients = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/api/users?role=patient", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
        console.log('Loaded patients:', res.data);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;
    // Fetch selected patient's water intake
    const fetchFluid = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/patient/water/${selectedPatient}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFluidData(res.data.map(d => ({
        date: new Date(d.date).toLocaleDateString(),
        ml: d.amount,
      })));
    };
    // Fetch selected patient's food log
    const fetchFood = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/patient/food/${selectedPatient}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodData(res.data.map(d => ({
        date: new Date(d.date).toLocaleDateString(),
        meal: d.meal,
        protein: d.protein,
        sodium: d.sodium,
        potassium: d.potassium,
        phosphorus: d.phosphorus,
      })));
    };
    fetchFluid();
    fetchFood();
  }, [selectedPatient]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 p-6 text-white font-sans">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">KidneyCare Staff</span>
        </div>
        <nav className="flex gap-6 font-semibold">
          <a href="#" className="hover:underline">Patients</a>
          <a href="#" className="hover:underline">Appointments</a>
          <a href="#" className="hover:underline">Reports</a>
          <a href="#" className="hover:underline">Settings</a>
        </nav>
        <button className="bg-pink-600 px-4 py-2 rounded-xl font-bold hover:bg-pink-700">Logout</button>
      </header>
      <div className="flex justify-center mb-8">
        <select
          className="text-black p-2 rounded-lg w-96"
          value={selectedPatient || ""}
          onChange={e => {
            setSelectedPatient(e.target.value);
            console.log('Selected patient:', e.target.value);
          }}
        >
          <option value="" disabled={!selectedPatient} hidden={!!selectedPatient}>Select patient...</option>
          {patients && patients.length > 0 ? patients.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} - {p.email}
            </option>
          )) : <option disabled>No patients found</option>}
        </select>
        {(!patients || patients.length === 0) && <div className="text-red-500 ml-4">No patients found or loaded.</div>}
      </div>
      {selectedPatient && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fluid Intake Card */}
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-purple-800 to-blue-700 p-6">
            <h2 className="text-xl font-bold mb-2">Fluid Intake (7 days)</h2>
            <p className="text-3xl">{fluidData.reduce((a, b) => a + b.ml, 0)} mL</p>
            <p className="text-sm">Daily limit: 1500 mL</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fluidData}>
                <Line type="monotone" dataKey="ml" stroke="#38bdf8" strokeWidth={3} />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Food Log Card */}
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-800 to-purple-700 p-6">
            <h2 className="text-xl font-bold mb-2">Food Log (7 days)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr>
                    <th className="px-2">Date</th>
                    <th className="px-2">Meal</th>
                    <th className="px-2">Protein</th>
                    <th className="px-2">Sodium</th>
                    <th className="px-2">Potassium</th>
                    <th className="px-2">Phosphorus</th>
                  </tr>
                </thead>
                <tbody>
                  {foodData.map((f, i) => (
                    <tr key={i} className="border-b border-white/20">
                      <td className="px-2">{f.date}</td>
                      <td className="px-2">{f.meal}</td>
                      <td className="px-2">{f.protein}</td>
                      <td className="px-2">{f.sodium}</td>
                      <td className="px-2">{f.potassium}</td>
                      <td className="px-2">{f.phosphorus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboardV2;
