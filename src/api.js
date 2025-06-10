import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
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

// Response interceptor: handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⛔ Unauthorized, redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const staffLogin = (userData) => api.post('/auth/staff/login', userData);

// WATER
export const logWater = (amount) => api.post('/patient/water', { amount });
export const getWaterLogs = () => api.get('/patient/water');

// BLOOD PRESSURE
export const logBloodPressure = (entry) => api.post('/patient/bloodpressure', entry);
export const getBloodPressureLogs = () => api.get('/patient/bloodpressure');

// MEDICATIONS
export const getMedications = () => api.get('/patient/medication');

// FOOD
export const logFood = async (foodData) => {
  try {
    const userRole = localStorage.getItem('userRole');
    const selectedPatientId = localStorage.getItem('selectedPatientId');

    const endpoint = ['nurse', 'doctor', 'admin'].includes(userRole)
      ? `/staff/patient/${selectedPatientId}/food`
      : '/patient/food';

    const response = await api.post(endpoint, foodData);
    return response.data;
  } catch (error) {
    console.error('🥩 Food logging error:', error);
    throw new Error(error?.response?.data?.message || 'Failed to log food entry.');
  }
};

export const getFoodLogs = async () => {
  try {
    const response = await api.get('/patient/food');
    return response.data;
  } catch (error) {
    console.error('🍔 Failed fetching food logs:', error);
    throw new Error('Could not fetch food logs.');
  }
};

// GENERAL
export const getSummary = (userId) => api.get(`/patient/summary/${userId}`);
export const getEntries = () => api.get('/patient/entries');
export const postEntry = (content) =>
  api.post('/patient/entries', { content });

export default api;
