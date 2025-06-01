import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KidneySmartDashboard.css';

const DAILY_LIMITS = {
  phosphorus: 1000, // mg
  potassium: 3000,  // mg
  sodium: 2400,     // mg
  protein: 80       // g
};

const KidneySmartDashboard = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({
    phosphorus: 0,
    potassium: 0,
    sodium: 0,
    protein: 0
  });
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
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/patient/food', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFoodEntries(response.data);
      calculateDailyTotals(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch food entries:', err);
      setLoading(false);
    }
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
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/patient/food', newEntry, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchFoodEntries();
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
            className={\`progress-bar \${color}\`}
            style={{ width: \`\${percentage}%\` }}
          />
        </div>
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
          className={\`tab \${selectedTab === 'log' ? 'active' : ''}\`}
          onClick={() => setSelectedTab('log')}
        >
          Food Log
        </button>
        <button 
          className={\`tab \${selectedTab === 'trends' ? 'active' : ''}\`}
          onClick={() => setSelectedTab('trends')}
        >
          Trends
        </button>
        <button 
          className={\`tab \${selectedTab === 'education' ? 'active' : ''}\`}
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
                <input
                  type="text"
                  placeholder="Meal (e.g., Breakfast)"
                  value={newEntry.meal}
                  onChange={e => setNewEntry({...newEntry, meal: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Food item"
                  value={newEntry.food}
                  onChange={e => setNewEntry({...newEntry, food: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={newEntry.protein}
                  onChange={e => setNewEntry({...newEntry, protein: Number(e.target.value)})}
                  required
                />
                <input
                  type="number"
                  placeholder="Phosphorus (mg)"
                  value={newEntry.phosphorus}
                  onChange={e => setNewEntry({...newEntry, phosphorus: Number(e.target.value)})}
                  required
                />
                <input
                  type="number"
                  placeholder="Potassium (mg)"
                  value={newEntry.potassium}
                  onChange={e => setNewEntry({...newEntry, potassium: Number(e.target.value)})}
                  required
                />
                <input
                  type="number"
                  placeholder="Sodium (mg)"
                  value={newEntry.sodium}
                  onChange={e => setNewEntry({...newEntry, sodium: Number(e.target.value)})}
                  required
                />
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
                      <button 
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="entry-details">
                      <p>Food: {entry.food}</p>
                      <p>Protein: {entry.protein}g</p>
                      <p>Phosphorus: {entry.phosphorus}mg</p>
                      <p>Potassium: {entry.potassium}mg</p>
                      <p>Sodium: {entry.sodium}mg</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === 'trends' && (
          <div className="trends-section">
            <h2>Weekly Nutrient Trends</h2>
            <div className="trends-placeholder">
              [Charts will be implemented in the next iteration]
            </div>
          </div>
        )}

        {selectedTab === 'education' && (
          <div className="education-section">
            <h2>Kidney-Friendly Diet Tips</h2>
            <div className="education-content">
              <h3>Managing Phosphorus</h3>
              <ul>
                <li>Limit dairy products, nuts, and dark sodas</li>
                <li>Choose fresh meats over processed meats</li>
                <li>Avoid foods with phosphate additives</li>
              </ul>

              <h3>Managing Potassium</h3>
              <ul>
                <li>Choose lower potassium fruits like apples and berries</li>
                <li>Limit portion sizes of high-potassium foods</li>
                <li>Double-boil vegetables to reduce potassium content</li>
              </ul>

              <h3>Managing Sodium</h3>
              <ul>
                <li>Cook meals from scratch to control sodium</li>
                <li>Use herbs and spices instead of salt</li>
                <li>Read food labels for hidden sodium</li>
              </ul>

              <h3>Protein Balance</h3>
              <ul>
                <li>Focus on high-quality protein sources</li>
                <li>Distribute protein intake throughout the day</li>
                <li>Work with your dietitian to determine your ideal protein intake</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidneySmartDashboard;
