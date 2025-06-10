import React, { useState, useEffect, useRef } from "react";
import { logFood } from "../api";
import { getFoodNutrients, getFoodSuggestions } from "../utils/foodLookup";
import "./FoodLogForm.css";

const DAILY_LIMITS = {
  phosphorus: 800,
  potassium: 2000,
  sodium: 2000,
  protein: 60
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
  const suggestionBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (form.foodName) {
      try {
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

          const currentWarnings = [];
          if (nutrients.phosphorus > DAILY_LIMITS.phosphorus * 0.3) {
            currentWarnings.push(`High phosphorus: ${nutrients.phosphorus}mg exceeds 30% of daily limit (${DAILY_LIMITS.phosphorus}mg)`);
          }
          if (nutrients.potassium > DAILY_LIMITS.potassium * 0.3) {
            currentWarnings.push(`High potassium: ${nutrients.potassium}mg exceeds 30% of daily limit (${DAILY_LIMITS.potassium}mg)`);
          }
          if (nutrients.sodium > DAILY_LIMITS.sodium * 0.3) {
            currentWarnings.push(`High sodium: ${nutrients.sodium}mg exceeds 30% of daily limit (${DAILY_LIMITS.sodium}mg)`);
          }
          setWarnings(currentWarnings);
        }
      } catch (_) {
        setWarnings([]);
      }
    }
  }, [form.foodName, form.servingSize]);

  const handleFoodNameChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, foodName: value }));
    try {
      if (value.length >= 2) {
        setSuggestions(getFoodSuggestions(value));
      } else {
        setSuggestions([]);
      }
    } catch (_) {
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
    setForm(prev => ({ ...prev, [name]: type === 'number' && value === '' ? '0' : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = { ...form };
      ["servingSize", "calories", "protein", "phosphorus", "sodium", "potassium"].forEach(key => {
        payload[key] = parseFloat(payload[key]);
      });
      await logFood(payload);
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
      setError(err.message || "Failed to log food entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="food-log-form" autoComplete="off">
      <h3>Log Your Meal</h3>
      <div className="form-group">
        <label>Date:<input type="date" name="dateConsumed" value={form.dateConsumed} onChange={handleChange} required /></label>
      </div>
      <div className="form-group">
        <label>Meal Type:
          <select name="mealType" value={form.mealType} onChange={handleChange} required>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>
      </div>
      <div className="food-input-container" ref={suggestionBoxRef}>
        <label>Food Name:
          <input
            type="text"
            name="foodName"
            value={form.foodName}
            onChange={handleFoodNameChange}
            required
            placeholder="Type to search foods..."
            autoComplete="off"
          />
        </label>
        {suggestions.length > 0 && (
          <ul className="food-suggestions">
            {suggestions.map((suggestion) => (
              <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="serving-container">
        <label>Serving Size:
          <input type="number" name="servingSize" value={form.servingSize} onChange={handleChange} required min="0" step="0.1" />
        </label>
        <label>Unit:
          <input type="text" name="servingUnit" value={form.servingUnit} readOnly />
        </label>
      </div>
      <div className="nutrients-container">
        <h4>Nutritional Information (calculated automatically)</h4>
        <div className="nutrient-grid">
          {['calories','protein','phosphorus','sodium','potassium'].map(key => (
            <label key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
              <input type="number" name={key} value={form[key]} readOnly />
            </label>
          ))}
        </div>
      </div>
      {warnings.length > 0 && (
        <div className="warnings-container">
          {warnings.map((w, i) => (
            <div key={i} className="warning-message">
              <span role="img" aria-label="warning">⚠️</span> {w}
            </div>
          ))}
        </div>
      )}
      <button type="submit" disabled={loading}>{loading ? "Logging..." : "Log Food"}</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default FoodLogForm;