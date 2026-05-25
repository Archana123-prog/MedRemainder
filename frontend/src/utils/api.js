import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('medremind_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medremind_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
