// This database contains nutrient information per 100g serving
export const foodDatabase = {
  "toast with butter": {
    protein: 3,
    phosphorus: 45,
    potassium: 50,
    sodium: 200
  },
  "scrambled eggs": {
    protein: 6,
    phosphorus: 100,
    potassium: 70,
    sodium: 150
  },
  "oatmeal": {
    protein: 5,
    phosphorus: 180,
    potassium: 150,
    sodium: 50
  },
  "banana": {
    protein: 1,
    phosphorus: 20,
    potassium: 360,
    sodium: 1
  },
  "steak": {
    calories: 250,
    protein: 26,
    phosphorus: 180,
    potassium: 320,
    sodium: 60,
    servingUnit: "g",
    defaultServing: 200
  },
  "chicken breast": {
    calories: 165,
    protein: 31,
    phosphorus: 200,
    potassium: 220,
    sodium: 65,
    servingUnit: "g",
    defaultServing: 150
  },
  "salmon": {
    calories: 208,
    protein: 22,
    phosphorus: 240,
    potassium: 380,
    sodium: 50,
    servingUnit: "g",
    defaultServing: 150
  },
  "rice": {
    calories: 130,
    protein: 4,
    phosphorus: 100,
    potassium: 80,
    sodium: 5,
    servingUnit: "g",
    defaultServing: 100
  }
};

// Helper function to normalize food name for lookup
export const normalizeFoodName = (name) => {
  return name.toLowerCase().trim();
};

// Function to get nutrient information for a food item
export const getFoodNutrients = (foodName, servingSize = 100) => {
  const normalizedName = normalizeFoodName(foodName);
  const foodData = foodDatabase[normalizedName];
  
  if (!foodData) {
    return null;
  }

  // Calculate nutrients based on serving size (nutrients in database are per 100g)
  const multiplier = servingSize / 100;
  return {
    calories: Math.round(foodData.calories * multiplier),
    protein: Math.round(foodData.protein * multiplier),
    phosphorus: Math.round(foodData.phosphorus * multiplier),
    potassium: Math.round(foodData.potassium * multiplier),
    sodium: Math.round(foodData.sodium * multiplier),
    servingUnit: foodData.servingUnit || "g",
    defaultServing: foodData.defaultServing || 100
  };
};

// Function to get suggestions based on partial input
export const getFoodSuggestions = (partial) => {
  const normalizedPartial = normalizeFoodName(partial);
  return Object.keys(foodDatabase)
    .filter(food => food.includes(normalizedPartial))
    .slice(0, 5); // Limit to 5 suggestions
};
