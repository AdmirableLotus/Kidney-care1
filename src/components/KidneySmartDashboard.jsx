import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './KidneySmartDashboard.css';
import { foodDatabase } from '../utils/foodLookup';

const DAILY_LIMITS = {
  phosphorus: 1000,
  potassium: 3000,
  sodium: 2400,
  protein: 80
};

const KidneySmartDashboard = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({
    phosphorus: 0,
    potassium: 0,
    sodium: 0,
    protein: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('log');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState({
    meal: '',
    food: '',
    protein: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0
  });

  useEffect(() => {
    fetchFoodEntries();
  }, []);
  const fetchFoodEntries = async () => {
    try {      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/patient/food', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort entries by date, most recent first
      const sortedEntries = response.data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setFoodEntries(sortedEntries);
      calculateDailyTotals(sortedEntries);
      processWeeklyData(sortedEntries);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch food entries:', err);
      setLoading(false);
    }
  };

  const processWeeklyData = (entries) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const weeklyTotals = last7Days.map(date => {
      const dayEntries = entries.filter(entry =>
        new Date(entry.date).toISOString().split('T')[0] === date
      );

      return {
        date,
        phosphorus: dayEntries.reduce((sum, entry) => sum + (entry.phosphorus || 0), 0),
        potassium: dayEntries.reduce((sum, entry) => sum + (entry.potassium || 0), 0),
        sodium: dayEntries.reduce((sum, entry) => sum + (entry.sodium || 0), 0),
        protein: dayEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0),
      };
    });

    setWeeklyData(weeklyTotals);
  };

  const calculateDailyTotals = (entries) => {
    const today = new Date().toLocaleDateString();
    const todayEntries = entries.filter(entry =>
      new Date(entry.date).toLocaleDateString() === today
    );

    const totals = todayEntries.reduce((acc, entry) => ({
      phosphorus: acc.phosphorus + (entry.phosphorus || 0),
      potassium: acc.potassium + (entry.potassium || 0),
      sodium: acc.sodium + (entry.sodium || 0),
      protein: acc.protein + (entry.protein || 0)
    }), { phosphorus: 0, potassium: 0, sodium: 0, protein: 0 });

    setDailyTotals(totals);
  };  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Get user ID from localStorage
      
      const entryWithDate = {
        ...newEntry,
        date: new Date().toISOString(),
        user: userId // Add the user ID to the entry
      };
      
      await axios.post('http://localhost:3000/api/patient/food', entryWithDate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchFoodEntries();
      setNewEntry({
        meal: '',
        food: '',
        protein: 0,
        phosphorus: 0,
        potassium: 0,
        sodium: 0
      });
    } catch (err) {
      console.error('Failed to add food entry:', err);
      alert('Failed to add food entry. Please try again.');
    }
  };
  const handleDeleteEntry = async (entryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/patient/food/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFoodEntries();
    } catch (err) {
      console.error('Failed to delete food entry:', err);
    }
  };

  const handleFoodInput = (e) => {
    const food = e.target.value.toLowerCase();
    const match = foodDatabase[food];

    if (match) {
      setNewEntry({
        ...newEntry,
        food: food,
        protein: match.protein,
        phosphorus: match.phosphorus,
        potassium: match.potassium,
        sodium: match.sodium
      });
    } else {
      setNewEntry({ ...newEntry, food });
    }
  };

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
          <div
            className={`progress-bar ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderTrendChart = () => {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
      <div className="trends-charts">
        {['phosphorus', 'potassium', 'sodium', 'protein'].map((nutrient, idx) => (
          <div className="trend-chart-container" key={nutrient}>
            <h3>{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip
                  labelFormatter={formatDate}
                  formatter={(value) => [`${value} ${nutrient === 'protein' ? 'g' : 'mg'}`, nutrient]}
                />
                <Line type="monotone" dataKey={nutrient} stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][idx]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="kidney-smart-dashboard">
      {/* Daily Summary Panel */}
      <section className="dashboard-section">
        <h1>Daily Nutrient Summary</h1>
        <div className="nutrient-grid">
          {renderProgressBar('Phosphorus', dailyTotals.phosphorus, DAILY_LIMITS.phosphorus)}
          {renderProgressBar('Potassium', dailyTotals.potassium, DAILY_LIMITS.potassium)}
          {renderProgressBar('Sodium', dailyTotals.sodium, DAILY_LIMITS.sodium)}
          {renderProgressBar('Protein', dailyTotals.protein, DAILY_LIMITS.protein)}
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${selectedTab === 'log' ? 'active' : ''}`}
          onClick={() => setSelectedTab('log')}
        >
          Food Log
        </button>
        <button
          className={`tab ${selectedTab === 'trends' ? 'active' : ''}`}
          onClick={() => setSelectedTab('trends')}
        >
          Trends
        </button>
        <button
          className={`tab ${selectedTab === 'education' ? 'active' : ''}`}
          onClick={() => setSelectedTab('education')}
        >
          Education
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === 'log' && (
          <div className="food-log-section">
            <div className="add-food-form">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <form onSubmit={handleAddEntry} className="entry-form">
                <input type="text" placeholder="Meal" value={newEntry.meal} onChange={e => setNewEntry({ ...newEntry, meal: e.target.value })} required />
                <input type="text" placeholder="Food item" value={newEntry.food} onChange={handleFoodInput} required />
                <input type="number" placeholder="Protein (g)" value={newEntry.protein} onChange={e => setNewEntry({ ...newEntry, protein: Number(e.target.value) })} required />
                <input type="number" placeholder="Phosphorus (mg)" value={newEntry.phosphorus} onChange={e => setNewEntry({ ...newEntry, phosphorus: Number(e.target.value) })} required />
                <input type="number" placeholder="Potassium (mg)" value={newEntry.potassium} onChange={e => setNewEntry({ ...newEntry, potassium: Number(e.target.value) })} required />
                <input type="number" placeholder="Sodium (mg)" value={newEntry.sodium} onChange={e => setNewEntry({ ...newEntry, sodium: Number(e.target.value) })} required />
                <button type="submit" className="add-entry-btn">Add Entry</button>
              </form>
            </div>

            <div className="food-entries">
              {loading ? (
                <p>Loading food entries...</p>
              ) : foodEntries.length === 0 ? (
                <p>No food entries yet today. Add your first meal!</p>
              ) : (
                foodEntries.map(entry => (
                  <div key={entry._id} className="food-entry-card">
                    <div className="entry-header">
                      <h3>{entry.meal}</h3>
                      <button onClick={() => handleDeleteEntry(entry._id)} className="delete-btn">Delete</button>
                    </div>
                    <div className="entry-details">
                      <p>Food: {entry.food}</p>
                      <p>Protein: {entry.protein}g</p>
                      <p>Phosphorus: {entry.phosphorus}mg</p>
                      <p>Potassium: {entry.potassium}mg</p>
                      <p>Sodium: {entry.sodium}mg</p>
                    </div>
                  </div>
                )))}
            </div>
          </div>
        )}

        {selectedTab === 'trends' && (
          <div className="trends-section">
            <h2>Weekly Nutrient Trends</h2>
            {loading ? (
              <div className="loading-spinner">Loading trends data...</div>
            ) : (
              renderTrendChart()
            )}
          </div>
        )}

        {selectedTab === 'education' && (
          <div className="education-section">
            <h2>Kidney-Friendly Diet Tips</h2>
            <div className="education-content">
              {/* ...Education content stays unchanged... */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidneySmartDashboard;
