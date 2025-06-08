// This database contains nutrient information per 100g serving unless otherwise specified
export const foodDatabase = {
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
    protein: 2.7,
    phosphorus: 43,
    potassium: 35,
    sodium: 1,
    servingUnit: "g",
    defaultServing: 150
  },
  "white bread": {
    calories: 265,
    protein: 9,
    phosphorus: 100,
    potassium: 115,
    sodium: 490,
    servingUnit: "g",
    defaultServing: 30
  },
  "egg": {
    calories: 155,
    protein: 13,
    phosphorus: 198,
    potassium: 138,
    sodium: 124,
    servingUnit: "piece",
    defaultServing: 1
  },
  "milk": {
    calories: 42,
    protein: 3.4,
    phosphorus: 93,
    potassium: 150,
    sodium: 44,
    servingUnit: "ml",
    defaultServing: 240
  },
  "apple": {
    calories: 52,
    protein: 0.3,
    phosphorus: 11,
    potassium: 107,
    sodium: 1,
    servingUnit: "piece",
    defaultServing: 1
  },
  "banana": {
    calories: 89,
    protein: 1.1,
    phosphorus: 22,
    potassium: 358,
    sodium: 1,
    servingUnit: "piece",
    defaultServing: 1
  },
  "spinach": {
    calories: 23,
    protein: 2.9,
    phosphorus: 49,
    potassium: 558,
    sodium: 79,
    servingUnit: "g",
    defaultServing: 100
  },
  "sweet potato": {
    calories: 86,
    protein: 1.6,
    phosphorus: 47,
    potassium: 337,
    sodium: 55,
    servingUnit: "g",
    defaultServing: 150
  },
  "beef steak": {
    calories: 250,
    protein: 26,
    phosphorus: 180,
    potassium: 320,
    sodium: 60,
    servingUnit: "g",
    defaultServing: 200
  },
  "greek yogurt": {
    calories: 59,
    protein: 10,
    phosphorus: 135,
    potassium: 141,
    sodium: 34,
    servingUnit: "g",
    defaultServing: 170
  },
  "almonds": {
    calories: 579,
    protein: 21,
    phosphorus: 481,
    potassium: 733,
    sodium: 1,
    servingUnit: "g",
    defaultServing: 30
  },
  "tuna": {
    calories: 116,
    protein: 26,
    phosphorus: 267,
    potassium: 323,
    sodium: 37,
    servingUnit: "g",
    defaultServing: 100
  },
  "oatmeal": {
    calories: 68,
    protein: 2.4,
    phosphorus: 41,
    potassium: 61,
    sodium: 2,
    servingUnit: "g",
    defaultServing: 40
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
    protein: Math.round(foodData.protein * multiplier * 10) / 10,
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
