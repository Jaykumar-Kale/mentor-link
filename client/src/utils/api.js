import axios from 'axios';

const configuredApiUrl = (process.env.REACT_APP_API_URL || '').trim();
const baseURL = configuredApiUrl ? configuredApiUrl.replace(/\/+$/, '') : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ml_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
