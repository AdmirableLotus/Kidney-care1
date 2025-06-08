import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set the token dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Water Intake
export const logWater = (amount) => api.post('/patient/water', { amount });
export const getWaterLogs = () => api.get('/patient/water');

// Food Logging
export const logFood = async (foodData) => {
  const token = localStorage.getItem('token');
  return api.post('/patient/food', foodData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getFoodLogs = async () => {
  const token = localStorage.getItem('token');
  return api.get('/patient/food', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export default api;
