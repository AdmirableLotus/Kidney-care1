import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './KidneySmartDashboard.css';
import { getFoodNutrients } from '../utils/foodLookup';
import FoodLogForm from './FoodLogForm';
import FoodLogList from './FoodLogList';

const DAILY_LIMITS = {
  phosphorus: 800,
  potassium: 2000,
  sodium: 2000,
  protein: 60
};

const checkNutrientLevels = (nutrients) => {
  const warnings = [];
  if (nutrients.phosphorus > DAILY_LIMITS.phosphorus) warnings.push(`High phosphorus: ${nutrients.phosphorus}mg exceeds daily limit of ${DAILY_LIMITS.phosphorus}mg`);
  if (nutrients.potassium > DAILY_LIMITS.potassium) warnings.push(`High potassium: ${nutrients.potassium}mg exceeds daily limit of ${DAILY_LIMITS.potassium}mg`);
  return warnings;
};

const KidneySmartDashboard = () => {
  const [dailyTotals, setDailyTotals] = useState({ phosphorus: 0, potassium: 0, sodium: 0, protein: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('log');
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    mealType: 'lunch',
    foodName: '',
    servingSize: '100',
    servingUnit: 'g',
    calories: '0',
    protein: '0',
    phosphorus: '0',
    potassium: '0',
    sodium: '0',
    dateConsumed: new Date().toISOString().split('T')[0]
  });
  // const [warnings, setWarnings] = useState([]);

  const fetchFoodEntries = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const selectedPatientId = localStorage.getItem('selectedPatientId');
      const endpoint = ['nurse', 'doctor', 'admin'].includes(userRole)
        ? `http://localhost:5000/api/staff/patient/${selectedPatientId}/food`
        : 'http://localhost:5000/api/patient/food';
      const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const sortedEntries = response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      calculateDailyTotals(sortedEntries);
      processWeeklyData(sortedEntries);
    } catch (err) {
      setDailyTotals({ phosphorus: 0, potassium: 0, sodium: 0, protein: 0 });
      setWeeklyData([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFoodEntries(); }, [fetchFoodEntries]);

  const processWeeklyData = (entries) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const weeklyTotals = last7Days.map(date => {
      const dayEntries = entries.filter(entry => new Date(entry.date).toISOString().split('T')[0] === date);
      return {
        date,
        phosphorus: dayEntries.reduce((sum, entry) => sum + (entry.phosphorus || 0), 0),
        potassium: dayEntries.reduce((sum, entry) => sum + (entry.potassium || 0), 0),
        sodium: dayEntries.reduce((sum, entry) => sum + (entry.sodium || 0), 0),
        protein: dayEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0)
      };
    });

    setWeeklyData(weeklyTotals);
  };

  const calculateDailyTotals = (entries) => {
    const today = new Date().toLocaleDateString();
    const todayEntries = entries.filter(entry => new Date(entry.date).toLocaleDateString() === today);

    const totals = todayEntries.reduce((acc, entry) => ({
      phosphorus: acc.phosphorus + (entry.phosphorus || 0),
      potassium: acc.potassium + (entry.potassium || 0),
      sodium: acc.sodium + (entry.sodium || 0),
      protein: acc.protein + (entry.protein || 0)
    }), { phosphorus: 0, potassium: 0, sodium: 0, protein: 0 });

    setDailyTotals(totals);
  };

  useEffect(() => {
    if (newEntry.foodName) {
      const nutrients = getFoodNutrients(newEntry.foodName, parseFloat(newEntry.servingSize));
      if (nutrients) {
        setNewEntry(prev => ({ ...prev, ...Object.fromEntries(Object.entries(nutrients).map(([k, v]) => [k, v.toString()])) }));
        // setWarnings(checkNutrientLevels(nutrients));
      }
    }
  }, [newEntry.foodName, newEntry.servingSize]);

  const renderProgressBar = (nutrient, value, limit) => {
    const percentage = Math.min((value / limit) * 100, 100);
    const color = percentage > 90 ? 'red' : percentage > 70 ? 'yellow' : 'green';
    return (
      <div className="nutrient-progress">
        <div className="progress-header">
          <p className="font-semibold">{nutrient}</p>
          <p>{value} / {limit} {nutrient === 'Protein' ? 'g' : 'mg'}</p>
        </div>
        <div className="progress-bar-bg">
          <div className={`progress-bar ${color}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  const renderTrendChart = () => (
    <div className="trends-charts">
      {['phosphorus', 'potassium', 'sodium', 'protein'].map((nutrient, idx) => (
        <div className="trend-chart-container" key={nutrient}>
          <h3>{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis />
              <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString('en-US')} formatter={(val) => [`${val} ${nutrient === 'protein' ? 'g' : 'mg'}`, nutrient]} />
              <Line type="monotone" dataKey={nutrient} stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][idx]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );

  return (
    <div className="kidney-smart-dashboard">
      <section className="dashboard-section">
        <h1>Daily Nutrient Summary</h1>
        <div className="nutrient-grid">
          {renderProgressBar('Phosphorus', dailyTotals.phosphorus, DAILY_LIMITS.phosphorus)}
          {renderProgressBar('Potassium', dailyTotals.potassium, DAILY_LIMITS.potassium)}
          {renderProgressBar('Sodium', dailyTotals.sodium, DAILY_LIMITS.sodium)}
          {renderProgressBar('Protein', dailyTotals.protein, DAILY_LIMITS.protein)}
        </div>
      </section>

      <div className="dashboard-tabs">
        {['log', 'trends', 'education'].map((tab) => (
          <button key={tab} className={`tab ${selectedTab === tab ? 'active' : ''}`} onClick={() => setSelectedTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {selectedTab === 'log' && (
          <div className="food-log-section">
            <FoodLogForm onEntryAdded={fetchFoodEntries} />
            <FoodLogList />
          </div>
        )}
        {selectedTab === 'trends' && (
          <div className="trends-section">
            <h2>Weekly Nutrient Trends</h2>
            {loading ? <div className="loading-spinner">Loading trends data...</div> : renderTrendChart()}
          </div>
        )}
        {selectedTab === 'education' && (
          <div className="education-section">
            <h2>Kidney-Friendly Diet Tips</h2>
            <div className="education-content">{/* placeholder */}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidneySmartDashboard;

