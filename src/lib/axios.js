import axios from "axios";
import { toast } from "react-toastify";
import { clearAuthStorage } from "./session";
import { goLogin } from "./nav";
import { store } from "../store/index";
import { logout } from "../store/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
    timeout: 15000,
});

// ALWAYS attach token from localStorage on every request
api.interceptors.request.use((cfg) => {
    // Ưu tiên đọc từ object 'auth', fallback sang 'accessToken' nếu có
    function getToken() {
        try {
            const authRaw = localStorage.getItem("auth");
            if (authRaw) {
                const parsed = JSON.parse(authRaw);
                if (parsed?.token) return parsed.token;
            }
        } catch {}
        return localStorage.getItem("accessToken");
    }
    const token = getToken();

    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

let isLoggingOut = false;
api.interceptors.response.use(
    (r) => {
        isLoggingOut = false;
        return r;
    },
    (e) => {
        if (e?.response?.status === 401 && !isLoggingOut) {
            isLoggingOut = true;
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            try {
                store.dispatch(logout());
            } catch {
                clearAuthStorage();
            }
            goLogin();
        }
        return Promise.reject(e);
    }
);

export default api;
