import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl+'api',
  headers: {
    'Accept': 'application/json',
  }
});

// ➕ Ajouter automatiquement le token d'auth si présent
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const token = JSON.parse(user)?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Don't set Content-Type for FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;