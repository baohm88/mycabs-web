import axios from "axios";
import { toast } from "react-toastify";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
  timeout: 15000,
});

// ALWAYS attach token from localStorage on every request
api.interceptors.request.use(cfg => {
  // Ưu tiên đọc từ object 'auth', fallback sang 'accessToken' nếu có
  const authRaw = localStorage.getItem('auth')
  const token =
    (authRaw ? JSON.parse(authRaw)?.token : null) ||
    localStorage.getItem('accessToken')

  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

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
