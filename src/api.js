
import axios from 'axios';

// 🤖 Automatically checks if you are running locally or on the internet
const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://onrender.com'; // 👈 Your live Render link

const api = axios.create({ 
  baseURL: `${BACKEND_URL}/api` // ✅ Points directly to your backend API route
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('luxe_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const errMsg = (e) => e?.response?.data?.message || 'Something went wrong. Try again.';
export default api;

