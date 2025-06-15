// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create a single axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('⛔ Unauthorized – redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = userData => api.post('/auth/register', userData);
export const login = creds => api.post('/auth/login', creds);
export const staffLogin = creds => api.post('/auth/staff/login', creds);

// Water intake
export const logWater = amount => api.post('/patient/water', { amount });
export const getWaterLogs = () => api.get('/patient/water');

// Blood pressure
export const logBloodPressure = entry => api.post('/patient/bloodpressure', entry);
export const getBloodPressureLogs = () => api.get('/patient/bloodpressure');

// Medication
export const getMedications = () => api.get('/patient/medication');

// Food logs (handles both patient and staff roles)
export const logFood = foodData => api.post(
  ['/nurse','/doctor','/admin'].includes(localStorage.getItem('userRole')) 
    ? `/staff/patient/${localStorage.getItem('selectedPatientId')}/food`
    : '/patient/food',
  foodData
);
export const getFoodLogs = () => api.get('/patient/food');

// Journal entries and summary
export const getSummary = userId => api.get(`/patient/summary/${userId}`);
export const getEntries = () => api.get('/patient/entries');
export const postEntry = content => api.post('/patient/entries', { content });

// Export default instance
export default api;
