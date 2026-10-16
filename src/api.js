import axios from 'axios';

// Backend address:
// - On your computer (localhost) it uses the local server.
// - On Vercel it uses VITE_API_URL, set in Vercel > Settings > Environment Variables,
//   e.g. https://luxe-interiors-api.onrender.com  (no trailing slash, no /api). Redeploy after changing it.
const fromEnv = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const BACKEND_URL = fromEnv || (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://interior-backend-4jov.onrender.com');

if (!fromEnv && window.location.hostname !== 'localhost') {
  console.warn('VITE_API_URL is not set, so API calls go to this same site and will fail. Set it in Vercel and redeploy.');
}

const api = axios.create({ baseURL: `${BACKEND_URL}/api` });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('luxe_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const errMsg = (e) => e?.response?.data?.message || 'Something went wrong. Try again.';
export default api;
