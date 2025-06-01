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
  const [storageError, setStorageError] = useState(false);
  const [isLoading, setIsLoading] = useState({
    fluid: false,
    food: false,
    labs: false,
    entries: false,
    meds: false
  });

  useEffect(() => {
    // Fetch all patients
    const fetchPatients = async () => {
      let token = null;
      try {
        token = localStorage.getItem("token");
        if (!token) {
          console.error('No auth token found');
          setStorageError(true);
          return;
        }
      } catch (e) {
        console.error('Access to storage is not allowed from this context.');
        setStorageError(true);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Loaded patients:', res.data);
        if (Array.isArray(res.data)) {
          setPatients(res.data);
          setStorageError(false);
        } else {
          console.error('Invalid patients data format:', res.data);
          setPatients([]);
        }
      } catch (err) {
        console.error('Failed to load patients:', err);
        setPatients([]);
        if (err.response?.status === 403) {
          setStorageError('Access denied. You may not have permission to view patients.');
        } else {
          setStorageError('Failed to load patients. Please try again later.');
        }
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    // Reset data when switching patients
    setFluidData([]);
    setFoodData([]);
    setLabResults([]);
    setPatientEntries([]);
    setMedications([]);

    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch selected patient's water intake
    const fetchFluid = async () => {
      setIsLoading(prev => ({ ...prev, fluid: true }));
      try {
        const res = await axios.get(`http://localhost:5000/api/patient/water/${selectedPatient}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const processedData = Array.isArray(res.data) ? res.data.map(d => ({
          date: new Date(d.date).toLocaleDateString(),
          ml: d.amount
        })) : [];
        setFluidData(processedData);
      } catch (err) {
        console.error('Error fetching fluid data:', err);
        setFluidData([]);
      }
      setIsLoading(prev => ({ ...prev, fluid: false }));
    };

    // Fetch selected patient's food log
    const fetchFood = async () => {
      setIsLoading(prev => ({ ...prev, food: true }));
      try {
        const res = await axios.get(`http://localhost:5000/api/patient/food/${selectedPatient}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const processedData = Array.isArray(res.data) ? res.data.map(d => ({
          date: new Date(d.date).toLocaleDateString(),
          meal: d.meal,
          protein: d.protein || 0,
          sodium: d.sodium || 0,
          potassium: d.potassium || 0,
          phosphorus: d.phosphorus || 0
        })) : [];
        setFoodData(processedData);
      } catch (err) {
        console.error('Error fetching food data:', err);
        setFoodData([]);
      }
      setIsLoading(prev => ({ ...prev, food: false }));
    };

    // Fetch lab results
    const fetchLabResults = async () => {
      setIsLoading(prev => ({ ...prev, labs: true }));
      try {
        const res = await axios.get(`http://localhost:5000/api/labresults/${selectedPatient}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLabResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching lab results:', err);
        setLabResults([]);
      }
      setIsLoading(prev => ({ ...prev, labs: false }));
    };

    // Fetch patient entries (journal)
    const fetchPatientEntries = async () => {
      setIsLoading(prev => ({ ...prev, entries: true }));
      try {
        const res = await axios.get(`http://localhost:5000/api/patient/entries/${selectedPatient}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatientEntries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching patient entries:', err);
        setPatientEntries([]);
      }
      setIsLoading(prev => ({ ...prev, entries: false }));
    };

    // Fetch medications
    const fetchMedications = async () => {
      setIsLoading(prev => ({ ...prev, meds: true }));
      try {
        const res = await axios.get(`http://localhost:5000/api/patient/medication/${selectedPatient}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching medications:', err);
        setMedications([]);
      }
      setIsLoading(prev => ({ ...prev, meds: false }));
    };

    // Fetch all data for the selected patient
    fetchFluid();
    fetchFood();
    fetchLabResults();
    fetchPatientEntries();
    fetchMedications();
  }, [selectedPatient]);

  // Get selected patient's name
  const getSelectedPatientName = () => {
    const patient = patients.find(p => p._id === selectedPatient);
    return patient ? patient.name : '--';
  };

  // Get total fluid intake for today
  const getTotalFluidIntake = () => {
    if (!fluidData || !fluidData.length) return '--';
    const today = new Date().toLocaleDateString();
    const todayData = fluidData.filter(d => d.date === today);
    const total = todayData.reduce((sum, d) => sum + (d.ml || 0), 0);
    return `${total} ml`;
  };

  // Get meals logged count for today
  const getMealsLoggedToday = () => {
    if (!foodData || !foodData.length) return '--';
    const today = new Date().toLocaleDateString();
    return foodData.filter(d => d.date === today).length;
  };

  // Get latest lab results count
  const getLabResultsCount = () => {
    return labResults && labResults.length ? labResults.length : '--';
  };

  // Get journal entries count
  const getJournalEntriesCount = () => {
    return patientEntries && patientEntries.length ? patientEntries.length : '--';
  };

  return (
    <div className="staff-dashboard-bg staff-dashboard-modern">
      <div className="staff-header-center">
        <span>KidneyCare Staff</span>
      </div>
      <header className="staff-header">
        <button className="staff-logout-btn">Logout</button>
      </header>
      {/* Show storage error if localStorage is blocked */}
      {storageError ? (
        <div className="staff-no-patients" style={{color: 'red', background: '#fff0f0'}}>
          {typeof storageError === 'string' ? storageError : 'Access to storage is not allowed from this context. Please run the app in a normal browser window and log in again.'}
        </div>
      ) :
      /* Centered patient dropdown under title, only visible when no patient is selected */
      !selectedPatient && (
        <div className="staff-patient-center-group">
          <div className="staff-patient-select">
            {patients && patients.length > 0 ? (
              <select
                className="staff-patient-dropdown"
                value={selectedPatient}
                onChange={e => {
                  setSelectedPatient(e.target.value);
                  console.log('Selected patient:', e.target.value);
                }}
              >
                <option value="">Select patient...</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name || 'Unnamed Patient'} - {p.email}
                  </option>
                ))}
              </select>
            ) : (
              <div className="staff-no-patients">No patients found or loaded.</div>
            )}
          </div>
        </div>
      )}
      
      {/* Show other nav buttons only after patient is selected */}
      {selectedPatient && (
        <nav className="staff-header-nav staff-nav-after-patient">
          <button type="button" className="staff-header-link">Appointments</button>
          <button type="button" className="staff-header-link">Reports</button>
          <button type="button" className="staff-header-link">Settings</button>
        </nav>
      )}

      {/* Modern Analytics Header, Circular Stats, and Patient Data Grid */}
      {selectedPatient && (
        <>
          <div className="staff-analytics-header">
            <div className="analytics-bg-circle"></div>
            <div className="analytics-header-content">
              <div className="analytics-avatar">
                <span role="img" aria-label="Patient Avatar">👤</span>
              </div>
              <h2 className="analytics-title">{getSelectedPatientName()}</h2>
              <p className="analytics-subtitle">Patient Overview</p>
            </div>
          </div>

          {/* Circular Stats */}
          <div className="staff-circular-stats">
            {/* Fluid Intake */}
            <div className="stat-widget">
              <div className="stat-svg">
                {isLoading.fluid ? (
                  <div className="loading-spinner">Loading...</div>
                ) : (
                  <svg width="110" height="110">
                    <circle cx="55" cy="55" r="48" fill="#e0f7fa" />
                    <circle
                      cx="55"
                      cy="55"
                      r="48"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="10"
                      strokeDasharray="301.59"
                      strokeDashoffset={301.59 - (fluidData.length ? Math.min(fluidData.reduce((a, b) => a + (b.ml || 0), 0) / 2000, 1) * 301.59 : 301.59)}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span className="stat-value stat-cyan">{getTotalFluidIntake()}</span>
              </div>
              <div className="stat-label">Fluid Intake</div>
            </div>

            {/* Meals Logged */}
            <div className="stat-widget">
              <div className="stat-svg">
                {isLoading.food ? (
                  <div className="loading-spinner">Loading...</div>
                ) : (
                  <svg width="110" height="110">
                    <circle cx="55" cy="55" r="48" fill="#fffde7" />
                    <circle
                      cx="55"
                      cy="55"
                      r="48"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="10"
                      strokeDasharray="301.59"
                      strokeDashoffset={301.59 - (foodData.length ? Math.min(getMealsLoggedToday() / 5, 1) * 301.59 : 301.59)}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span className="stat-value stat-yellow">{getMealsLoggedToday()}</span>
              </div>
              <div className="stat-label">Meals Logged Today</div>
            </div>

            {/* Lab Results */}
            <div className="stat-widget">
              <div className="stat-svg">
                {isLoading.labs ? (
                  <div className="loading-spinner">Loading...</div>
                ) : (
                  <svg width="110" height="110">
                    <circle cx="55" cy="55" r="48" fill="#fce4ec" />
                    <circle
                      cx="55"
                      cy="55"
                      r="48"
                      fill="none"
                      stroke="#f472b6"
                      strokeWidth="10"
                      strokeDasharray="301.59"
                      strokeDashoffset={301.59 - (labResults.length ? Math.min(labResults.length / 10, 1) * 301.59 : 301.59)}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span className="stat-value stat-pink">{getLabResultsCount()}</span>
              </div>
              <div className="stat-label">Lab Results</div>
            </div>

            {/* Journal Entries */}
            <div className="stat-widget">
              <div className="stat-svg">
                {isLoading.entries ? (
                  <div className="loading-spinner">Loading...</div>
                ) : (
                  <svg width="110" height="110">
                    <circle cx="55" cy="55" r="48" fill="#e8f5e9" />
                    <circle
                      cx="55"
                      cy="55"
                      r="48"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="10"
                      strokeDasharray="301.59"
                      strokeDashoffset={301.59 - (patientEntries.length ? Math.min(patientEntries.length / 10, 1) * 301.59 : 301.59)}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span className="stat-value stat-green">{getJournalEntriesCount()}</span>
              </div>
              <div className="stat-label">Journal Entries</div>
            </div>
          </div>

          {/* Main Patient Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fluid Intake Card */}
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-purple-800 to-blue-700 p-6">
              <h2 className="text-xl font-bold mb-2">Fluid Intake (7 days)</h2>
              {isLoading.fluid ? (
                <div className="loading-spinner">Loading fluid data...</div>
              ) : (
                <>
                  <p className="text-3xl">{getTotalFluidIntake()}</p>
                  <p className="text-sm">Daily limit: 1500 mL</p>
                  {fluidData.length > 0 && (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={fluidData}>
                        <Line type="monotone" dataKey="ml" stroke="#38bdf8" strokeWidth={3} />
                        <XAxis dataKey="date" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </>
              )}
            </div>

            {/* Food Log Card */}
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-800 to-purple-700 p-6">
              <h2 className="text-xl font-bold mb-2">Food Log (7 days)</h2>
              {isLoading.food ? (
                <div className="loading-spinner">Loading food data...</div>
              ) : (
                <div className="overflow-x-auto">
                  {foodData.length > 0 ? (
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
                            <td className="px-2">{f.protein}g</td>
                            <td className="px-2">{f.sodium}mg</td>
                            <td className="px-2">{f.potassium}mg</td>
                            <td className="px-2">{f.phosphorus}mg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No food logs available for the last 7 days.</p>
                  )}
                </div>
              )}
            </div>

            {/* Medication List */}
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-800 to-purple-700 p-6">
              <h2 className="text-xl font-bold mb-2">Medications</h2>
              {isLoading.meds ? (
                <div className="loading-spinner">Loading medications...</div>
              ) : (
                <>
                  {medications.length > 0 ? (
                    <ul>
                      {medications.map(med => (
                        <li key={med._id} className="mb-2 p-2 bg-white/10 rounded">
                          <strong>{med.name}</strong> ({med.dosage}) - {med.frequency}
                          {med.notes && <span className="block text-sm opacity-80 mt-1">Notes: {med.notes}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No medications recorded.</p>
                  )}
                </>
              )}
            </div>

            {/* Patient Journal Entries */}
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-pink-800 to-purple-700 p-6 col-span-2">
              <h2 className="text-xl font-bold mb-2">Patient Journal Entries</h2>
              {isLoading.entries ? (
                <div className="loading-spinner">Loading journal entries...</div>
              ) : (
                <>
                  {patientEntries.length > 0 ? (
                    <ul>
                      {patientEntries.map((entry, idx) => (
                        <li key={entry._id || idx} className="mb-2 p-2 bg-white/10 rounded">
                          <span className="font-semibold">{new Date(entry.date || entry.createdAt).toLocaleDateString()}:</span> {entry.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No journal entries available.</p>
                  )}
                </>
              )}
            </div>

            {/* Blood Pressure Chart */}
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-800 to-green-700 p-6 col-span-2">
              <h2 className="text-xl font-bold mb-2">Blood Pressure</h2>
              <BloodPressureChart patientId={selectedPatient} />
            </div>
          </div>
        </>
      )}

      {/* Lab Results Entry */}
      {selectedPatient && (
        <div className="rounded-xl shadow-lg bg-gradient-to-br from-green-800 to-blue-700 p-6 mt-8">
          <h2 className="text-xl font-bold mb-2">Lab Results Entry</h2>
          <StaffLabResultForm onAdded={() => {
            const fetchLabResults = async () => {
              const token = localStorage.getItem('token');
              const res = await axios.get(`http://localhost:5000/api/labresults/${selectedPatient}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setLabResults(Array.isArray(res.data) ? res.data : []);
            };
            fetchLabResults();
          }} />
        </div>
      )}
    </div>
  );
};

export default StaffDashboardV2;
