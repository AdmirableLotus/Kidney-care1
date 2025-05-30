import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StaffLabResultForm from './StaffLabResultForm';
import MedicationList from './MedicationList';
import BloodPressureChart from './BloodPressureChart';
import './StaffDashboardV2.css';

const StaffDashboardV2 = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [fluidData, setFluidData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [patientEntries, setPatientEntries] = useState([]);
  const [medications, setMedications] = useState([]);

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
    // Fetch lab results
    const fetchLabResults = async () => {
      const token = localStorage.getItem('token');
      axios.get(`/api/labresults/${selectedPatient}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setLabResults(res.data)).catch(() => setLabResults([]));
    };
    // Fetch patient entries (journal)
    const fetchPatientEntries = async () => {
      const token = localStorage.getItem('token');
      axios.get(`/api/patient/entries?userId=${selectedPatient}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setPatientEntries(res.data)).catch(() => setPatientEntries([]));
    };
    // Fetch medications
    const fetchMedications = async () => {
      const token = localStorage.getItem('token');
      axios.get(`/api/patient/medication/${selectedPatient}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setMedications(res.data)).catch(() => setMedications([]));
    };
    fetchFluid();
    fetchFood();
    fetchLabResults();
    fetchPatientEntries();
    fetchMedications();
  }, [selectedPatient]);

  return (
    <div className="staff-dashboard-bg">
      <header className="staff-header">
        <div className="staff-header-title">
          <span>KidneyCare Staff</span>
        </div>
        <nav className="staff-header-nav">
          <a href="#">Patients</a>
          <a href="#">Appointments</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </nav>
        <button className="staff-logout-btn">Logout</button>
      </header>
      <div className="staff-patient-select">
        <select
          className="staff-patient-dropdown"
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
        {(!patients || patients.length === 0) && <div className="staff-no-patients">No patients found or loaded.</div>}
      </div>
      {/* Modern Analytics Header */}
      {selectedPatient && (
        <div className="staff-analytics-header">
          <div className="analytics-bg-circle"></div>
          <div className="analytics-header-content">
            <div className="analytics-avatar">
              <span>👤</span>
            </div>
            <h2 className="analytics-title">{patients.find(p => p._id === selectedPatient)?.name || '--'}</h2>
            <p className="analytics-subtitle">Patient Overview</p>
          </div>
        </div>
      )}

      {/* Circular Summary Stats */}
      {selectedPatient && (
        <div className="staff-circular-stats">
          {/* Fluid Intake */}
          <div className="stat-widget">
            <div className="stat-svg">
              <svg width="110" height="110">
                <circle cx="55" cy="55" r="48" fill="#e0f7fa" />
                <circle cx="55" cy="55" r="48" fill="none" stroke="#38bdf8" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset={(301.59 - (fluidData && fluidData.length ? Math.min(fluidData.reduce((a, b) => a + b.ml, 0) / 2000, 1) * 301.59 : 0))} strokeLinecap="round" />
              </svg>
              <span className="stat-value stat-cyan">{fluidData && fluidData.length ? fluidData.reduce((a, b) => a + b.ml, 0) : '--'}<span className="stat-unit">ml</span></span>
            </div>
            <div className="stat-label">Fluid Intake</div>
          </div>
          {/* Meals Logged */}
          <div className="stat-widget">
            <div className="stat-svg">
              <svg width="110" height="110">
                <circle cx="55" cy="55" r="48" fill="#fffde7" />
                <circle cx="55" cy="55" r="48" fill="none" stroke="#fbbf24" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset={(301.59 - (foodData && foodData.length ? Math.min(foodData.length / 10, 1) * 301.59 : 0))} strokeLinecap="round" />
              </svg>
              <span className="stat-value stat-yellow">{foodData && foodData.length ? foodData.length : '--'}</span>
            </div>
            <div className="stat-label">Meals Logged</div>
          </div>
          {/* Lab Results */}
          <div className="stat-widget">
            <div className="stat-svg">
              <svg width="110" height="110">
                <circle cx="55" cy="55" r="48" fill="#fce4ec" />
                <circle cx="55" cy="55" r="48" fill="none" stroke="#f472b6" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset={(301.59 - (labResults && labResults.length ? Math.min(labResults.length / 10, 1) * 301.59 : 0))} strokeLinecap="round" />
              </svg>
              <span className="stat-value stat-pink">{labResults && labResults.length ? labResults.length : '--'}</span>
            </div>
            <div className="stat-label">Lab Results</div>
          </div>
          {/* Journal Entries */}
          <div className="stat-widget">
            <div className="stat-svg">
              <svg width="110" height="110">
                <circle cx="55" cy="55" r="48" fill="#e8f5e9" />
                <circle cx="55" cy="55" r="48" fill="none" stroke="#34d399" strokeWidth="10" strokeDasharray="301.59" strokeDashoffset={(301.59 - (patientEntries && patientEntries.length ? Math.min(patientEntries.length / 10, 1) * 301.59 : 0))} strokeLinecap="round" />
              </svg>
              <span className="stat-value stat-green">{patientEntries && patientEntries.length ? patientEntries.length : '--'}</span>
            </div>
            <div className="stat-label">Journal Entries</div>
          </div>
        </div>
      )}
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
          {/* Lab Results Table */}
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-green-800 to-blue-700 p-6">
            <h2 className="text-xl font-bold mb-2">Lab Results</h2>
            <table className="min-w-full text-white">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Albumin</th>
                  <th>enPCR</th>
                  <th>spKt/V</th>
                  <th>K</th>
                  <th>Hgb</th>
                  <th>P</th>
                  <th>Ca</th>
                  <th>iPTH</th>
                  <th>Avg Fluid Gain</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {labResults.map(lr => (
                  <tr key={lr._id}>
                    <td>{new Date(lr.date).toLocaleDateString()}</td>
                    <td>{lr.albumin}</td>
                    <td>{lr.enPCR}</td>
                    <td>{lr.spKtV}</td>
                    <td>{lr.potassium}</td>
                    <td>{lr.hemoglobin}</td>
                    <td>{lr.phosphorus}</td>
                    <td>{lr.calciumTotal}</td>
                    <td>{lr.iPTH}</td>
                    <td>{lr.avgFluidWeightGain}</td>
                    <td>{lr.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Medication List */}
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-800 to-purple-700 p-6">
            <h2 className="text-xl font-bold mb-2">Medications</h2>
            <ul>
              {medications.map(med => (
                <li key={med._id}>
                  <strong>{med.name}</strong> ({med.dosage}) - {med.frequency}
                  {med.notes && <span> | {med.notes}</span>}
                </li>
              ))}
            </ul>
          </div>
          {/* Patient Journal Entries */}
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-pink-800 to-purple-700 p-6 col-span-2">
            <h2 className="text-xl font-bold mb-2">Patient Journal Entries</h2>
            <ul>
              {patientEntries.map((entry, idx) => (
                <li key={entry._id || idx} className="mb-2 p-2 bg-white/10 rounded">
                  <span className="font-semibold">{new Date(entry.date || entry.createdAt).toLocaleDateString()}:</span> {entry.content}
                </li>
              ))}
            </ul>
          </div>
          {/* Blood Pressure Chart */}
          <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-800 to-green-700 p-6 col-span-2">
            <h2 className="text-xl font-bold mb-2">Blood Pressure</h2>
            <BloodPressureChart patientId={selectedPatient} />
          </div>
        </div>
      )}
      {/* Lab Results Entry */}
      <div className="rounded-xl shadow-lg bg-gradient-to-br from-green-800 to-blue-700 p-6 mt-8">
        <h2 className="text-xl font-bold mb-2">Lab Results Entry</h2>
        <StaffLabResultForm />
      </div>
    </div>
  );
};

export default StaffDashboardV2;
