import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
  timeout: 15000,
});

// ALWAYS attach token from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const saved = JSON.parse(localStorage.getItem("auth") || "null");
    const token = saved?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore JSON parse errors
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      // Optionally: dispatch(logout()); navigate("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
