import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './KidneySmartDashboard.css';
import { foodDatabase, getFoodNutrients } from '../utils/foodLookup';

// Define daily nutrient limits (in mg)
const DAILY_LIMITS = {
  phosphorus: 800, // mg per day
  potassium: 2000, // mg per day
  sodium: 2000, // mg per day
  protein: 60 // g per day
};

const checkNutrientLevels = (nutrients) => {
  const warnings = [];
  if (nutrients.phosphorus > DAILY_LIMITS.phosphorus) {
    warnings.push(`High phosphorus: ${nutrients.phosphorus}mg exceeds daily limit of ${DAILY_LIMITS.phosphorus}mg`);
  }
  if (nutrients.potassium > DAILY_LIMITS.potassium) {
    warnings.push(`High potassium: ${nutrients.potassium}mg exceeds daily limit of ${DAILY_LIMITS.potassium}mg`);
  }
  return warnings;
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
  const [searchTerm, setSearchTerm] = useState('');  const [newEntry, setNewEntry] = useState({
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
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoodEntries();
  }, []);

  const fetchFoodEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const selectedPatientId = localStorage.getItem('selectedPatientId');

      // Use different endpoints based on user role
      const endpoint = ['nurse', 'doctor', 'admin'].includes(userRole)
        ? `http://localhost:5000/api/staff/patient/${selectedPatientId}/food`
        : 'http://localhost:5000/api/patient/food';

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched food entries:', response.data);
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
      setError('Unable to load food entries. Please check your connection or try again later.');
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
    setError(null);

    if (!newEntry.foodName || !newEntry.servingSize || !newEntry.servingUnit) {
      setError('Food name, serving size, and serving unit are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const selectedPatientId = localStorage.getItem('selectedPatientId');

      // Convert string values to numbers
      const entryData = {
        ...newEntry,
        servingSize: parseFloat(newEntry.servingSize),
        calories: parseFloat(newEntry.calories),
        protein: parseFloat(newEntry.protein),
        phosphorus: parseFloat(newEntry.phosphorus),
        sodium: parseFloat(newEntry.sodium),
        potassium: parseFloat(newEntry.potassium)
      };

      // Use different endpoints based on user role
      const endpoint = ['nurse', 'doctor', 'admin'].includes(userRole)
        ? `http://localhost:5000/api/staff/patient/${selectedPatientId}/food`
        : 'http://localhost:5000/api/patient/food';

      await axios.post(endpoint, entryData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form
      setNewEntry({
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

      // Refresh food entries
      await fetchFoodEntries();
    } catch (err) {
      console.error('Failed to add food entry:', err);
      setError(err.response?.data?.message || 'Failed to add food entry. Please try again.');
    }
  };
  const handleDeleteEntry = async (entryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patient/food/${entryId}`, {
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

  // Update nutrient values when food name or serving size changes
  useEffect(() => {
    if (newEntry.foodName) {
      const nutrients = getFoodNutrients(newEntry.foodName, parseFloat(newEntry.servingSize));
      if (nutrients) {
        setNewEntry(prev => ({
          ...prev,
          calories: nutrients.calories.toString(),
          protein: nutrients.protein.toString(),
          phosphorus: nutrients.phosphorus.toString(),
          sodium: nutrients.sodium.toString(),
          potassium: nutrients.potassium.toString()
        }));

        // Check for nutrient warnings
        const currentWarnings = checkNutrientLevels(nutrients);
        setWarnings(currentWarnings);
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

  const renderLogTab = () => (
    <div className="food-log-section">
      <form onSubmit={handleAddEntry} className="food-entry-form">
        <div className="form-row">
          <div className="form-group">
            <select
              value={newEntry.mealType}
              onChange={(e) => setNewEntry({ ...newEntry, mealType: e.target.value })}
              required
              className="meal-type-select"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="form-group flex-grow">
            <input
              type="text"
              placeholder="Enter food name (e.g., steak)"
              value={newEntry.foodName}
              onChange={(e) => setNewEntry({ ...newEntry, foodName: e.target.value })}
              required
              className="food-name-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="number"
              placeholder="Serving size"
              value={newEntry.servingSize}
              onChange={(e) => setNewEntry({ ...newEntry, servingSize: e.target.value })}
              min="0"
              step="0.1"
              required
              className="serving-size-input"
            />
          </div>
          <div className="form-group">
            <select
              value={newEntry.servingUnit}
              onChange={(e) => setNewEntry({ ...newEntry, servingUnit: e.target.value })}
              required
              className="unit-select"
            >
              <option value="g">grams (g)</option>
              <option value="oz">ounces (oz)</option>
              <option value="cup">cups</option>
              <option value="piece">pieces</option>
            </select>
          </div>
        </div>

        {/* Auto-calculated nutrients display */}
        <div className="nutrients-display">
          <h4>Nutritional Information (Auto-calculated)</h4>
          <div className="nutrients-grid">
            <div className="nutrient-item">
              <label>Calories:</label>
              <span>{newEntry.calories} kcal</span>
            </div>
            <div className="nutrient-item">
              <label>Protein:</label>
              <span>{newEntry.protein}g</span>
            </div>
            <div className="nutrient-item">
              <label>Phosphorus:</label>
              <span>{newEntry.phosphorus}mg</span>
            </div>
            <div className="nutrient-item">
              <label>Potassium:</label>
              <span>{newEntry.potassium}mg</span>
            </div>
            <div className="nutrient-item">
              <label>Sodium:</label>
              <span>{newEntry.sodium}mg</span>
            </div>
          </div>

          {/* Nutrient warnings */}
          {warnings.length > 0 && (
            <div className="nutrient-warnings">
              {warnings.map((warning, index) => (
                <div key={index} className="warning-message">
                  ⚠️ {warning}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">Add Food Entry</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );

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
        {selectedTab === 'log' && renderLogTab()}

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
