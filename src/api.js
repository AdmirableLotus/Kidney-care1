import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with retry logic
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

// Add request interceptor to handle token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const staffLogin = (userData) => api.post('/auth/staff/login', userData);

// Water Intake
export const logWater = (amount) => api.post('/patient/water', { amount });
export const getWaterLogs = () => api.get('/patient/water');

// Food Logging
export const logFood = async (foodData) => {
  try {
    const response = await api.post('/patient/food', foodData);
    return response.data;
  } catch (error) {
    console.error('Food logging error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.code === 'ECONNRESET') {
      throw new Error('Connection lost. Please try again.');
    } else {
      throw new Error('Failed to log food entry. Please try again.');
    }
  }
};

export const getFoodLogs = async () => {
  try {
    const response = await api.get('/patient/food');
    return response.data;
  } catch (error) {
    console.error('Food logs fetch error:', error);
    throw new Error('Failed to fetch food logs. Please try again.');
  }
};

export default api;
