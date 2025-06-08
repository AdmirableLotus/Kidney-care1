import React, { useState, useEffect } from "react";
import { logFood } from "../api";
import { getFoodNutrients, getFoodSuggestions } from "../utils/foodLookup";
import "./FoodLogForm.css";

const FoodLogForm = ({ onEntryAdded }) => {
  const [form, setForm] = useState({
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
    
    try {      // Convert string values to numbers for the API
      const formData = {
        ...form,
        servingSize: parseFloat(form.servingSize),
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein),
        phosphorus: parseFloat(form.phosphorus),
        sodium: parseFloat(form.sodium),
        potassium: parseFloat(form.potassium)
      };

      console.log("Submitting food entry:", formData); // Debug log

      const response = await logFood(formData);

      if (response.status === 201) {
        setForm({
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
        if (onEntryAdded) onEntryAdded();
      }
    } catch (err) {
      console.error('Error submitting food entry:', err);
      setError(
        err.response?.data?.message || 
        "Failed to log food entry. Please make sure you're logged in and all required fields are filled."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="food-log-form">
      <h3>Log Your Meal</h3>
      <div>
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
      <button type="submit" disabled={loading}>
        {loading ? "Logging..." : "Log Food"}
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
};

export default FoodLogForm;
