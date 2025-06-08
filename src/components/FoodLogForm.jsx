import React, { useState, useEffect } from "react";
import { logFood } from "../api";
import { getFoodNutrients, getFoodSuggestions } from "../utils/foodLookup";
import "./FoodLogForm.css";

const DAILY_LIMITS = {
  phosphorus: 800, // mg per day
  potassium: 2000, // mg per day
  sodium: 2000, // mg per day
  protein: 60 // g per day
};

const FoodLogForm = ({ onEntryAdded }) => {
  const [form, setForm] = useState({
    mealType: "lunch",
    dateConsumed: new Date().toISOString().split("T")[0],
    foodName: "",
    servingSize: "100",
    servingUnit: "g",
    calories: "0",
    protein: "0",
    phosphorus: "0",
    sodium: "0",
    potassium: "0"
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [success, setSuccess] = useState("");

  // Update nutrients when food name or serving size changes
  useEffect(() => {
    if (form.foodName) {
      const nutrients = getFoodNutrients(form.foodName, parseFloat(form.servingSize));
      if (nutrients) {
        setForm(prev => ({
          ...prev,
          calories: nutrients.calories.toString(),
          protein: nutrients.protein.toString(),
          phosphorus: nutrients.phosphorus.toString(),
          sodium: nutrients.sodium.toString(),
          potassium: nutrients.potassium.toString(),
          servingUnit: nutrients.servingUnit
        }));

        // Check for nutrient warnings
        const currentWarnings = [];
        if (nutrients.phosphorus > DAILY_LIMITS.phosphorus * 0.3) {
          currentWarnings.push(`High phosphorus: ${nutrients.phosphorus}mg is more than 30% of daily limit (${DAILY_LIMITS.phosphorus}mg)`);
        }
        if (nutrients.potassium > DAILY_LIMITS.potassium * 0.3) {
          currentWarnings.push(`High potassium: ${nutrients.potassium}mg is more than 30% of daily limit (${DAILY_LIMITS.potassium}mg)`);
        }
        if (nutrients.sodium > DAILY_LIMITS.sodium * 0.3) {
          currentWarnings.push(`High sodium: ${nutrients.sodium}mg is more than 30% of daily limit (${DAILY_LIMITS.sodium}mg)`);
        }
        setWarnings(currentWarnings);
      }
    }
  }, [form.foodName, form.servingSize]);

  const handleFoodNameChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, foodName: value }));
    if (value.length >= 2) {
      const newSuggestions = getFoodSuggestions(value);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const nutrients = getFoodNutrients(suggestion);
    setForm(prev => ({
      ...prev,
      foodName: suggestion,
      servingSize: nutrients.defaultServing.toString(),
      servingUnit: nutrients.servingUnit,
      calories: nutrients.calories.toString(),
      protein: nutrients.protein.toString(),
      phosphorus: nutrients.phosphorus.toString(),
      sodium: nutrients.sodium.toString(),
      potassium: nutrients.potassium.toString()
    }));
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number' && value === '') {
      setForm(prev => ({ ...prev, [name]: '0' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const formData = {
        ...form,
        servingSize: parseFloat(form.servingSize),
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein),
        phosphorus: parseFloat(form.phosphorus),
        sodium: parseFloat(form.sodium),
        potassium: parseFloat(form.potassium)
      };

      await logFood(formData);
      
      setForm({
        mealType: "lunch",
        dateConsumed: new Date().toISOString().split("T")[0],
        foodName: "",
        servingSize: "100",
        servingUnit: "g",
        calories: "0",
        protein: "0",
        phosphorus: "0",
        sodium: "0",
        potassium: "0"
      });
      setSuccess("Food entry logged successfully!");
      setWarnings([]);
      if (onEntryAdded) onEntryAdded();
    } catch (err) {
      console.error('Error submitting food entry:', err);
      setError(err.message || "Failed to log food entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="food-log-form">
      <h3>Log Your Meal</h3>
      <div className="form-group">
        <label>
          Date:
          <input 
            type="date" 
            name="dateConsumed" 
            value={form.dateConsumed} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Meal Type:
          <select
            name="mealType"
            value={form.mealType}
            onChange={handleChange}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>
      </div>
      <div className="food-input-container">
        <label>
          Food Name:
          <input 
            type="text" 
            name="foodName" 
            value={form.foodName} 
            onChange={handleFoodNameChange} 
            required 
            placeholder="Type to search foods..." 
          />
        </label>
        {suggestions.length > 0 && (
          <ul className="food-suggestions">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion} 
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="serving-container">
        <label>
          Serving Size:
          <input 
            type="number" 
            name="servingSize" 
            value={form.servingSize} 
            onChange={handleChange} 
            required 
            min="0"
            step="0.1"
          />
        </label>
        <label>
          Unit:
          <input 
            type="text" 
            name="servingUnit" 
            value={form.servingUnit} 
            readOnly 
          />
        </label>
      </div>
      <div className="nutrients-container">
        <h4>Nutritional Information (calculated automatically)</h4>
        <div className="nutrient-grid">
          <label>
            Calories:
            <input 
              type="number" 
              name="calories" 
              value={form.calories} 
              readOnly 
            />
          </label>
          <label>
            Protein (g):
            <input 
              type="number" 
              name="protein" 
              value={form.protein} 
              readOnly 
            />
          </label>
          <label>
            Phosphorus (mg):
            <input 
              type="number" 
              name="phosphorus" 
              value={form.phosphorus} 
              readOnly 
            />
          </label>
          <label>
            Sodium (mg):
            <input 
              type="number" 
              name="sodium" 
              value={form.sodium} 
              readOnly 
            />
          </label>
          <label>
            Potassium (mg):
            <input 
              type="number" 
              name="potassium" 
              value={form.potassium} 
              readOnly 
            />
          </label>
        </div>
      </div>
      {warnings.length > 0 && (
        <div className="warnings-container">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-message">
              ⚠️ {warning}
            </div>
          ))}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Logging..." : "Log Food"}
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default FoodLogForm;
