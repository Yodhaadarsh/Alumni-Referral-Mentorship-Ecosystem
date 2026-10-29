import axios from 'axios';
export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const api = axios.create({ baseURL: `${API}/api` });
api.interceptors.request.use(c => {
  const t = localStorage.getItem('token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
export const roomId = (a, b) => [a, b].sort().join('_');
export const DEMO = false;
