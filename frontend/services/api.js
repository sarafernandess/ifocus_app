import axios from 'axios';
import { getAuthToken } from './firebaseConfig';

const api = axios.create({
  baseURL: 'http://192.168.1.2:8000',
  timeout: 10000, // Tempo máximo de espera
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
